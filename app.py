"""Flask application serving the portfolio site."""

import json
import re
import threading
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, jsonify, render_template, request, send_from_directory
from werkzeug.exceptions import HTTPException

import data

app = Flask(__name__)
app.jinja_env.globals["now"] = lambda: datetime.now(timezone.utc)
app.config["MAX_CONTENT_LENGTH"] = 32 * 1024  # 32 KB request cap

BASE_DIR = Path(__file__).resolve().parent
MESSAGES_FILE = BASE_DIR / "messages.json"
_messages_lock = threading.Lock()

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


@app.context_processor
def inject_profile():
    return {"profile": data.PROFILE}


@app.route("/")
def index():
    return render_template(
        "index.html",
        profile=data.PROFILE,
        about=data.ABOUT_TEXT,
        highlights=data.HIGHLIGHTS,
        education=data.EDUCATION,
        projects=data.PROJECTS,
        skills=data.SKILLS,
        experience=data.EXPERIENCE,
        certifications=data.CERTIFICATIONS,
    )


@app.route("/api/contact", methods=["POST"])
def contact():
    payload = request.get_json(silent=True) or {}
    name = str(payload.get("name", "")).strip()
    email = str(payload.get("email", "")).strip()
    message = str(payload.get("message", "")).strip()
    website = str(payload.get("website", "")).strip()  # honeypot

    errors = {}
    if not name or len(name) > 100:
        errors["name"] = "Please enter your name (max 100 characters)."
    if not EMAIL_RE.match(email) or len(email) > 254:
        errors["email"] = "Please enter a valid email address."
    if not message or len(message) > 5000:
        errors["message"] = "Please enter a message (max 5000 characters)."
    if errors:
        return jsonify({"ok": False, "errors": errors}), 400

    if website:  # bots fill hidden fields - silently drop
        return jsonify({"ok": True})

    entry = {
        "name": name,
        "email": email,
        "message": message,
        "received_at": datetime.now(timezone.utc).isoformat(),
    }
    with _messages_lock:
        messages = []
        if MESSAGES_FILE.exists():
            try:
                messages = json.loads(MESSAGES_FILE.read_text("utf-8"))
            except (json.JSONDecodeError, OSError):
                messages = []
        messages.append(entry)
        tmp = MESSAGES_FILE.with_suffix(".tmp")
        tmp.write_text(json.dumps(messages, indent=2), "utf-8")
        tmp.replace(MESSAGES_FILE)

    return jsonify({"ok": True, "message": "Thanks! I'll get back to you soon."})


@app.route("/resume")
@app.route("/resume.pdf")
def resume():
    return send_from_directory(
        BASE_DIR / "static" / "resume",
        "resume.pdf",
        mimetype="application/pdf",
        as_attachment=True,
        download_name=f"{data.PROFILE['name'].replace(' ', '_')}_Resume.pdf",
    )


@app.errorhandler(HTTPException)
def handle_http_error(exc):
    if request.path.startswith("/api/"):
        return jsonify({"ok": False, "error": exc.description}), exc.code
    return exc


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
