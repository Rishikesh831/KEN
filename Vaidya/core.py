import os, time
from dataclasses import dataclass, field
os.system("")  # enables ANSI colours on Windows terminals

COL = {"coord": "\033[96m", "intake": "\033[95m", "safety": "\033[93m", "pharm": "\033[92m",
       "pay": "\033[94m", "logi": "\033[36m", "family": "\033[91m", "rec": "\033[35m"}
NAME = {"coord": "Ananya Iyer · Coordinator", "intake": "Meera Joshi · Intake",
        "safety": "Vaidya Sharma · Safety Gate", "pharm": "Arjun Mehta · Pharmacy",
        "pay": "Kabir Shah · Payments", "logi": "Sana Khan · Logistics",
        "family": "Ravi Kumar · Family Liaison", "rec": "Nisha Rao · Records"}
MARK = {"ok": "✓", "warn": "!", "stop": "✗"}


class Ledger:
    """Action ledger: every agent action is printed and kept as evidence."""
    def __init__(self, speed=1.0):
        self.rows, self.speed = [], speed

    def log(self, agent, msg, evidence="", kind="ok"):
        t = time.strftime("%H:%M:%S")
        print(f"{t} {COL[agent]}{NAME[agent]:<30}\033[0m {MARK[kind]} {msg}")
        if evidence:
            print(f"{'':>9} \033[90m  evidence: {evidence}\033[0m")
        self.rows.append(dict(t=t, agent=agent, msg=msg, evidence=evidence, kind=kind))
        time.sleep(1.0 / self.speed)


@dataclass
class Item:
    id: str
    patient: str
    owner: str
    payer: str
    kind: str
    state: str = "OPEN"
    data: dict = field(default_factory=dict)


class Agent:
    key = ""
    def __init__(self, ledger, store, rails):
        self.L, self.S, self.R = ledger, store, rails

    def say(self, msg, ev="", kind="ok"):
        self.L.log(self.key, msg, ev, kind)
