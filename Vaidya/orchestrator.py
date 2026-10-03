from core import Item, Ledger
from tools import Store, Rails
from agents import Coordinator, Intake, SafetyGate, Pharmacy, Payments, Logistics, Family, Records


class Vaidya:
    """The team + the pipeline. Coordinator routes: Pharmacy -> Safety -> Payments -> Logistics -> Payments."""
    def __init__(self, speed=1.0):
        self.S = Store(); self.R = Rails(self.S); self.L = Ledger(speed)
        a = (self.L, self.S, self.R)
        self.coord, self.intake, self.safety, self.pharm = Coordinator(*a), Intake(*a), SafetyGate(*a), Pharmacy(*a)
        self.pay, self.logi, self.family, self.rec = Payments(*a), Logistics(*a), Family(*a), Records(*a)
        self.n = 100

    def _item(self, pkey):
        p = self.S.patients[pkey]; self.n += 1
        it = Item(f"R-{self.n}", p["name"], p["owner"], p["payer"], "refill", data=dict(pkey=pkey))
        self.S.items.append(it)
        return it

    def refill(self, pkey, veto=False):
        it = self._item(pkey); p = self.S.patients[pkey]
        self.coord.open(it)
        q = self.pharm.source(it)
        if not q:
            self.family.ask_owner(it, "No same-district pharmacy found. Arrange local pickup?", ["Accept", "Pass", "Snooze"])
            return it
        it.data["quote"] = q
        if self.safety.review(it) != "ACT":
            self.family.ask_owner(it, "Quote differs from last order. Approve?", ["Approve", "Reject"])
            return it
        self.pay.hold(it)
        if not self.logi.ship(it):
            self.pay.refund(it)
            self.family.ask_owner(it, f"Courier cannot reach {p['name']}. Local pickup by a neighbour?",
                                  ["Accept", "Pass to Neha", "Snooze"])
            self.coord.say("Local pickup arranged. Item stays open until handover is confirmed.", "pickup 16:30")
            return it
        if veto:
            text = self.intake.hear(p["name"], "ruk jao, abhi mat bhejo")
            if self.intake.is_stop(text):
                self.coord.pause_all(p["name"], "parent paused")
                self.logi.cancel(it); self.pay.refund(it)
                self.family.tell(f"{p['name']} has paused this refill. Nothing was charged. Ask again tomorrow, or will you talk to them?")
                return it
        self.logi.track(it)
        self.pay.release(it)
        p["days_left"] = 34
        self.coord.close(it, f"{p['name']} has 34 days of stock.")
        return it

    def voice_note(self, pkey, text):
        p = self.S.patients[pkey]
        heard = self.intake.hear(p["name"], text)
        if self.safety.red_flag(heard):
            self.coord.pause_all(p["name"], "red flag")
            self.family.alert(p["name"])

    def doc_request(self, pkey, requester):
        self.rec.send(pkey, requester)
