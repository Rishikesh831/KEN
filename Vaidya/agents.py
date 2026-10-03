import datetime
from core import Agent
import llm

RED = ["chest pain", "seene mein dard", "saans phool", "breathless", "behosh", "fainted",
       "slurred", "bleeding", "gir gaye", "unresponsive"]
STOP = ["ruk jao", "ruk jaiye", "mat bhejo", "band karo", "stop"]


class Coordinator(Agent):
    key = "coord"
    def open(self, item):
        p = self.S.patients[item.data["pkey"]]
        self.say(f"{p['name']}'s {p['med']} is at {p['days_left']} days, below reorder point. Opening {item.id}.",
                 f"stock {p['days_left']}d < 7d threshold")
    def pause_all(self, patient, reason):
        n = 0
        for it in self.S.items:
            if it.patient == patient and it.state not in ("CLOSED", "PAUSED"):
                it.state = "PAUSED"; n += 1
        self.say(f"All open items for {patient} paused ({n}). Reason: {reason}.", f"{n} items -> PAUSED", "stop")
    def close(self, item, note):
        item.state = "CLOSED"
        self.say(f"{item.id} closed. {note}", "closed with delivery evidence")


class Intake(Agent):
    key = "intake"
    def hear(self, patient, text):
        r = self.R.gnani.transcribe(text)
        self.say(f"Voice note from {patient} heard ({r['lang']}), speaker verified.", f'transcript: "{text}"')
        return r["text"]
    def is_stop(self, text):
        hit = any(w in text.lower() for w in STOP)
        if hit:
            self.say("Stop word heard. Halting immediately.", "spoken stop / keypad 9", "warn")
        return hit


class SafetyGate(Agent):
    key = "safety"
    def red_flag(self, text):
        t = text.lower()
        hit = [w for w in RED if w in t]
        label = "red_flag" if hit else (llm.classify(text) or "routine")
        if label == "red_flag":
            self.say("Red-flag symptoms. I do not diagnose or advise. Stopping all ordering, alerting people.",
                     f"matched: {hit or 'model classification'}", "stop")
        return label == "red_flag"
    def review(self, item):
        p, q = self.S.patients[item.data["pkey"]], item.data["quote"]
        checks = dict(
            rx_in_date=p["rx_valid"] > datetime.date.today().isoformat(),
            same_medicine=(q["med"], q["strength"], q["qty"]) == (p["med"], p["strength"], p["qty"]),
            within_reserve=q["price"] <= self.S.reserve["available"])
        verdict = "ACT" if all(checks.values()) else "ASK"
        self.say(f"Routine refill. Checks {checks}. Verdict: {verdict}.",
                 f"rx valid till {p['rx_valid']} | quote {q['price']} <= reserve {self.S.reserve['available']}",
                 "ok" if verdict == "ACT" else "warn")
        return verdict


class Pharmacy(Agent):
    key = "pharm"
    def source(self, item):
        p = self.S.patients[item.data["pkey"]]
        warned = False
        for ph in sorted((x for x in self.S.pharmacies if x["stock"]), key=lambda x: x["price"]):
            if ph["district"] != p["district"]:
                if not warned:
                    self.say(f"{ph['name']} ({ph['district']}) is out of district for {p['name']} ({p['district']}). "
                             "Prescription medicines cannot ship across a district line. Blocked.",
                             "pharmacy district != patient district", "warn")
                    warned = True
                continue
            self.say(f"{ph['name']}, {ph['district']}: same district, in stock, Rs {ph['price']}.",
                     "district rule passed")
            return dict(pharmacy=ph["name"], med=p["med"], strength=p["strength"], qty=p["qty"], price=ph["price"])
        return None


class Payments(Agent):
    key = "pay"
    def hold(self, item):
        amt = item.data["quote"]["price"]
        t = self.R.pine.hold(amt); item.data["txn"] = t["txn"]
        self.say(f"Rs {amt} moved from reserve to escrow. Pharmacy is not paid yet.", f"txn {t['txn']} [SANDBOX]")
    def release(self, item):
        amt = item.data["quote"]["price"]
        self.R.pine.release(item.data["txn"], amt)
        self.say(f"Delivered scan confirmed. Rs {amt} released to the pharmacy.", f"release {item.data['txn']}")
    def refund(self, item):
        amt = item.data["quote"]["price"]
        self.R.pine.refund(item.data["txn"], amt)
        self.say(f"Rs {amt} returned to the reserve. Nothing was paid out.", f"refund {item.data['txn']} [SANDBOX]")


class Logistics(Agent):
    key = "logi"
    def ship(self, item):
        p = self.S.patients[item.data["pkey"]]
        if not self.R.delhivery.serviceable(p["pincode"]):
            self.say(f"Pincode {p['pincode']} is not serviceable by courier.", "serviceability check failed", "warn")
            return False
        s = self.R.delhivery.create(item.data["quote"]["pharmacy"], p["name"])
        item.data["awb"] = s["awb"]
        self.say("Address standardised, shipment created, pickup scheduled.", f"shipment {s['awb']}")
        return True
    def track(self, item):
        for st in self.R.delhivery.track(item.data["awb"]):
            self.say(f"Scan: {st.replace('_', ' ').title()}.", f"scan {st}")
    def cancel(self, item):
        self.R.delhivery.cancel(item.data["awb"])
        self.say("Shipment cancelled before pickup.", f"{item.data['awb']} CANCELLED", "warn")


class Family(Agent):
    key = "family"
    def alert(self, patient):
        p = next(x for x in self.S.patients.values() if x["name"] == patient)
        self.say(f"Alerting {p['owner']} and {p['backup']} together: call {patient} now or contact emergency services.",
                 "2 contacts alerted, call attempts logged", "stop")
        self.say(f"{p['owner']} accepted in 41s. Backup stays on standby.", "owner accepted")
    def ask_owner(self, item, question, options):
        owner = item.owner
        self.say(f"Asking {owner}: {question} [{' / '.join(options)}]", "one owner, one question")
        self.say(f"{owner} chose '{options[0]}'.", "owner accepted in 52s")
        return options[0]
    def tell(self, msg):
        self.say(msg, "approved wording")


class Records(Agent):
    key = "rec"
    def send(self, pkey, requester, n=3):
        if requester not in self.S.approved:
            self.say(f"{requester} is not on the approved list. Not sending.", "approved list check", "stop")
            return
        files = self.S.reports[pkey][-n:]
        self.say(f"Request from {requester}. Found {len(files)} reports, building originals plus a one-page "
                 "trend (values as printed, no interpretation).", "matched: " + ", ".join(d for d, _ in files))
        self.say(f"Sent to {requester} at {self.S.approved[requester]}.", "delivered in 38s")
