"""Mock rails: Pine Labs (payments), Delhivery (logistics), Gnani (voice). All sandbox data."""
import itertools


class Store:
    def __init__(self):
        base = dict(owner="Rishikesh", payer="Rishikesh", backup="Neha")
        self.patients = {
            "papa": dict(base, name="Papa", district="Amritsar", pincode="143001", med="Metformin",
                         strength="500mg", qty=60, days_left=4, rx_valid="2027-01-15"),
            "maa": dict(base, name="Maa", district="Krishna", pincode="520001", med="Telmisartan",
                        strength="40mg", qty=30, days_left=5, rx_valid="2027-03-02"),
        }
        self.reserve = dict(available=2500, hold=0, released=0)
        self.pharmacies = [
            dict(name="Sharma Medicos", district="Amritsar", price=840, stock=True),
            dict(name="MedPlus Hyderabad", district="Hyderabad", price=610, stock=True),
            dict(name="Lakshmi Medicals", district="Krishna", price=700, stock=True),
        ]
        self.reports = {"papa": [("2026-06-12", "sugar_report.pdf"), ("2026-08-18", "sugar_report.pdf"),
                                 ("2026-09-24", "sugar_report.pdf")]}
        self.approved = {"Dr. Kapoor": "+91 98xxx xx210"}
        self.items = []


class PineLabs:
    _n = itertools.count(88412)
    def __init__(self, s): self.s = s
    def hold(self, amt):
        r = self.s.reserve
        if amt > r["available"]:
            raise ValueError("amount exceeds care reserve")
        r["available"] -= amt; r["hold"] += amt
        return dict(txn=f"PL-{next(self._n)}", amount=amt, status="HELD")
    def release(self, txn, amt):
        r = self.s.reserve; r["hold"] -= amt; r["released"] += amt
        return dict(txn=txn, status="RELEASED")
    def refund(self, txn, amt):
        r = self.s.reserve; r["hold"] -= amt; r["available"] += amt
        return dict(txn=txn, status="REFUNDED")


class Delhivery:
    _n = itertools.count(772310)
    STEPS = ["PICKED_UP", "OUT_FOR_DELIVERY", "DELIVERED"]
    def serviceable(self, pincode): return pincode != "520001"  # mock: Maa's pincode is not reachable
    def create(self, frm, to): return dict(awb=f"DL-{next(self._n)}", status="CREATED")
    def cancel(self, awb): return dict(awb=awb, status="CANCELLED")
    def track(self, awb): return iter(self.STEPS)


class Gnani:
    def transcribe(self, text): return dict(text=text, lang="hi")
    def call(self, who, script): return dict(who=who, disposition="CONNECTED")


class Rails:
    def __init__(self, store):
        self.pine, self.delhivery, self.gnani = PineLabs(store), Delhivery(), Gnani()
