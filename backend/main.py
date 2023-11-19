from flask import Flask, request, redirect, Response
from flask_cors import CORS

import yaml
import json

from data import Database
from spotify import SpotifyManager

import sys
import threading

with open('config.yml', 'r') as file:
    config = yaml.safe_load(file)

name = config['app']
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
    token = spotifyManager.generate_access_token(code)
    return redirect(client_url + '?access_token=' + token)

@app.route("/api/ping", methods=["GET"])
def ping():
    return "Pong"

@app.route("/api/characters", methods=["GET"])
def get_all_characters():
    return database.get_characters().to_json()

@app.route("/api/characters/<path>", methods=["GET"])
def get_character(path):
    try:
        return database.get_character_by_path(path).to_json()
    except Exception as e:
        return Response(json.dumps({'message': str(e)}), status=404)

@app.route("/api/playlist/global/<path>", methods=["GET"])
def get_character_global_playlist(path):
    return database.get_character_songs_by_path(path).to_json()

@app.route("/api/playlist/mine/<character_id>", methods=["GET", "POST"])
def character_my_playlist(character_id):
    body = request.get_json()
    token = body['access_token']
    if request.method == "POST":
        song_id = body['song_id']
        user_data = spotifyManager.get_user_data(token)
        song_data = database.get_song(song_id)
        if song_data is None:
            song_data = spotifyManager.get_song(token, song_id)
            database.post_song(song_id, song_data)
        
        duplicate = database.post_character_song(character_id, song_id, user_data['id'])

        return json.dumps({
            'duplicate': not duplicate,
            'song': song_data.to_json()
        })

    elif request.method == "GET":
        user_data = spotifyManager.get_user_data(token)
        try:
            return database.get_character_songs(character_id, user_data.id).to_json()
        except Exception as e:
            return Response(json.dumps({'message': str(e)}), status=404)

def main():
    app.run(host='localhost', port=5000)

if __name__ == '__main__':
    sys.setrecursionlimit(20971520)
    threading.stack_size(1342177280)

    main_thread = threading.Thread(target=main)
    main_thread.start()
    main_thread.join()
