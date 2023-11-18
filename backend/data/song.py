import json

class Song:
    def __init__(self, spotify_id):
        self.spotify_id = spotify_id

class Playlist:
    def __init__(self, songs):
        self.songs = songs
