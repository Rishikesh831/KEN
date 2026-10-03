"""python run_demo.py [all|refill|red|dist|rec|veto] [--speed 1.5]"""
import argparse, json
from orchestrator import Vaidya

def head(t): print(f"\n\033[1m=== {t} ===\033[0m")

ap = argparse.ArgumentParser()
ap.add_argument("scenario", nargs="?", default="all")
ap.add_argument("--speed", type=float, default=1.0)
a = ap.parse_args()
v = Vaidya(a.speed)
SC = {
    "refill": ("Refill: Papa's Metformin, stock alert to escrow release", lambda: v.refill("papa")),
    "red":    ("Red flag: Papa's voice note", lambda: (v._item("papa"), v.voice_note("papa", "seene mein dard ho raha hai aur saans phoolti hai"))),
    "dist":   ("Out of district: Maa's Telmisartan", lambda: v.refill("maa")),
    "rec":    ("Reports in a minute: Dr. Kapoor asks", lambda: v.doc_request("papa", "Dr. Kapoor")),
    "veto":   ("Parent pauses: Papa says stop", lambda: (v.S.patients["papa"].update(days_left=4), v.refill("papa", veto=True))),
}
for k in (SC if a.scenario == "all" else [a.scenario]):
    head(SC[k][0])
    SC[k][1]()
r = v.S.reserve
head(f"Reserve: available Rs {r['available']} | on hold Rs {r['hold']} | released Rs {r['released']}")
json.dump(v.L.rows, open("ledger.json", "w"), indent=2)
