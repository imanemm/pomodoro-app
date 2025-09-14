# Imports
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS
import os

# My App

app = Flask(__name__)

db_url = os.environ.get("DATABASE_URL")
if db_url:
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql+psycopg://", 1)
    elif db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///pomodoro.db"

app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_pre_ping": True,
    "pool_recycle": 300,
}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

CORS(app, resources={r"/api/*": {"origins": [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://imanemm.github.io"
]}})

db = SQLAlchemy(app)


# Data Class ~ Row of Data
class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)

    def __repr__(self):
        return f"<Project {self.id} - {self.name}>"
    
class Session(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=True)
    ended_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    duration_sec = db.Column(db.Integer, nullable=False)
    kind = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f"<Session {self.id} - {self.kind}, {self.duration_sec}s>"

@app.route('/')
def index():
    return "Pomodoro App is running!"


@app.route('/api/health', methods=['GET'])
def check_health():
    return jsonify({'ok': True }), 200

@app.route('/api/sessions', methods=['POST'])
def create_session():
    try:
        data = request.get_json(silent=True) or {}
        try:
            duration = int(data.get('duration_sec', 0))
        except:
            return jsonify({'error': 'duration_sec must be an integer'}), 400
        
        kind = (data.get('kind') or '').lower()

        if kind not in {'long-break', 'short-break', 'pomodoro'} or duration <= 0:
            return jsonify({'error': 'Invalid payload'}), 400

        new_session = Session(
            project_id = None, #Optional
            duration_sec = duration,
            kind = kind
        )

        db.session.add(new_session)
        db.session.commit()
        return jsonify({'message': 'Session saved!'}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        
@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        total_sessions = Session.query.count()
        total_focus_sec = db.session.query(db.func.coalesce(db.func.sum(
            db.case((Session.kind == 'pomodoro', Session.duration_sec), else_=0)
            ), 0)).scalar()
        total_all_sec = db.session.query(db.func.coalesce(db.func.sum(Session.duration_sec), 0)).scalar()
        return jsonify ({
            'total_sessions' : total_sessions,
            'total_focus_sec' : total_focus_sec,
            'total_focus_min' : total_focus_sec // 60,
            'total_all_sec' : total_all_sec
        }), 200
    except Exception as e: 
        return jsonify({'error': str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)