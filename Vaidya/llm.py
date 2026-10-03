"""Optional: uses Claude to classify free text when no keyword matches. Falls back silently."""
import os

def classify(text):
    if not os.getenv("ANTHROPIC_API_KEY"):
        return None
    try:
        import anthropic
        r = anthropic.Anthropic().messages.create(
            model="claude-sonnet-5-5", max_tokens=5,
            messages=[{"role": "user", "content":
                       "Classify this elder's note for a care coordinator with exactly one word: "
                       f"routine, anomaly or red_flag.\n\n{text}"}])
        w = r.content[0].text.strip().lower()
        return w if w in ("routine", "anomaly", "red_flag") else None
    except Exception:
        return None
