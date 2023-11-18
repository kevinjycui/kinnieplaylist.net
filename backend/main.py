from flask import Flask, request, redirect
from flask_cors import CORS

import yaml
import json

from data import Database
from spotify import SpotifyManager

with open('config.yml', 'r') as file:
    config = yaml.safe_load(file)

client_url = config['client']

app = Flask(__name__)
CORS(app)

database = Database()
spotifyManager = SpotifyManager()

@app.route("/auth/login", methods=["GET"])
def login_spotify():
    return redirect(spotifyManager.generate_auth_code())

@app.route("/auth/callback", methods=["GET"])
def callback_spotify():
    code = request.args.get('code')
    spotifyManager.generate_access_token(code)
    return redirect(client_url)

@app.route("/auth/token", methods=["GET"])
def get_spotify_token():
    return json.dumps({'access_token': spotifyManager.access_token})

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
