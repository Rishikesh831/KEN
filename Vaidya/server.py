"""
Vaidya FastAPI backend — connects the React frontend to the Python agent system.

Install:
    pip install fastapi uvicorn sse-starlette

Run:
    uvicorn server:app --reload --port 8001

Then in the React app:
    VITE_API_URL=http://localhost:8001 npm run dev
"""

import asyncio
import json
import sys
import os

# Add Vaidya dir to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from orchestrator import Vaidya

app = FastAPI(title="Vaidya API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Shared Vaidya instance
V = Vaidya(speed=100)  # high speed = no sleep between log entries

# --- REST endpoints ---

@app.get("/state")
def get_state():
    patients = []
    for key, p in V.S.patients.items():
        patients.append({
            "key": key,
            "name": p["name"],
            "district": p["district"],
            "med": p["med"],
            "strength": p["strength"],
            "qty": p["qty"],
            "days_left": p["days_left"],
            "owner": p["owner"],
            "backup": p["backup"],
            "nextAction": f"Refill pending — {p['district']}",
        })
    return {
        "patients": patients,
        "reserve": V.S.reserve,
        "items": [{"id": i.id, "patient": i.patient, "state": i.state} for i in V.S.items],
    }


@app.get("/ledger")
def get_ledger():
    return V.L.rows


@app.get("/events")
async def events():
    """SSE stream — runs the full demo scenario and pushes rows as they arrive."""
    async def generate():
        # Reset
        V.L.rows.clear()
        V.S.items.clear()
        V.n = 100

        # Run all scenarios in a thread to avoid blocking
        loop = asyncio.get_event_loop()
        queue = asyncio.Queue()

        original_log = V.L.log

        def patched_log(agent, msg, evidence="", kind="ok"):
            original_log(agent, msg, evidence, kind)
            row = V.L.rows[-1]
            loop.call_soon_threadsafe(queue.put_nowait, row)

        V.L.log = patched_log

        import threading

        def run_scenarios():
            V.refill("papa")
            V.voice_note("papa", "seene mein dard ho raha hai aur saans phoolti hai")
            V.refill("maa")
            V.doc_request("papa", "Dr. Kapoor")
            V.refill("papa", veto=True)
            queue.put_nowait(None)  # sentinel

        thread = threading.Thread(target=run_scenarios, daemon=True)
        thread.start()

        while True:
            row = await queue.get()
            if row is None:
                break
            yield f"data: {json.dumps(row)}\n\n"
            await asyncio.sleep(0.05)  # small delay for UI to breathe

    return StreamingResponse(generate(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@app.post("/run/{scenario}")
def run_scenario(scenario: str):
    """Run a named scenario and return its ledger rows."""
    before = len(V.L.rows)
    if scenario == "refill":
        V.refill("papa")
    elif scenario == "red_flag":
        V.voice_note("papa", "seene mein dard ho raha hai aur saans phoolti hai")
    elif scenario == "maa_refill":
        V.refill("maa")
    elif scenario == "records":
        V.doc_request("papa", "Dr. Kapoor")
    elif scenario == "parent_pauses":
        V.refill("papa", veto=True)
    new_rows = V.L.rows[before:]
    return {"rows": new_rows, "reserve": V.S.reserve}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
