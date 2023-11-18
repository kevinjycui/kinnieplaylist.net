import json

class Song:
    def __init__(self, song_id, spotify_id, title, img_file, artists, spotify_uri, genres, explicit, duration, preview_url):
        self.song_id = song_id
        self.spotify_id = spotify_id
        self.title = title
        self.img_file = img_file
        self.artists = artists.split(',')
        self.spotify_uri = spotify_uri
        self.genres = genres.split(',')
        self.explicit = explicit
        self.duration = duration
        self.preview_url = preview_url

class Playlist:
    def __init__(self, songs):
        self.songs = songs
