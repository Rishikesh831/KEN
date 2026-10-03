"""Optional: exposes the mock rails as MCP tools so AgenticOrg can register this server (see the student guide).
pip install mcp ; python mcp_server.py  -> serves on http://localhost:8000/mcp (needs a public URL for AgenticOrg)."""
from mcp.server.fastmcp import FastMCP
from tools import Store, Rails
from agents import RED

S = Store(); R = Rails(S)
mcp = FastMCP("vaidya-tools")

@mcp.tool()
def check_district_rule(patient_district: str, pharmacy_district: str) -> dict:
    """Prescription medicines may only ship within the patient's own district."""
    return {"allowed": patient_district == pharmacy_district}

@mcp.tool()
def red_flag_check(text: str) -> dict:
    """Keyword red-flag screen for a parent's note."""
    hit = [w for w in RED if w in text.lower()]
    return {"red_flag": bool(hit), "matched": hit}

@mcp.tool()
def hold_payment(amount: int) -> dict:
    """Move money from the care reserve into escrow (sandbox)."""
    return R.pine.hold(amount)

@mcp.tool()
def release_payment(txn: str, amount: int) -> dict:
    """Release escrow to the pharmacy after a Delivered scan (sandbox)."""
    return R.pine.release(txn, amount)

@mcp.tool()
def create_shipment(pincode: str) -> dict:
    """Create a courier shipment if the pincode is serviceable (sandbox)."""
    return R.delhivery.create("pharmacy", pincode) if R.delhivery.serviceable(pincode) else {"error": "not serviceable"}

if __name__ == "__main__":
    mcp.run(transport="streamable-http")
