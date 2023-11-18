from flask import Flask
from flask_cors import CORS

from data import Database

app = Flask(__name__)
CORS(app)

database = Database()

@app.route("/api/ping", methods=["GET"])
def ping():
    return "Pong"

@app.route("/api/characters", methods=["GET"])
def get_all_characters():
    return database.get_characters().to_json()

@app.route("/api/characters/<character_id>", methods=["GET"])
def get_character(character_id):
    return database.get_character(character_id).to_json()

if __name__ == '__main__':
    app.run(host='localhost', port=5000)
