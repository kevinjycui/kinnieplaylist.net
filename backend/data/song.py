import json

class Song:
    def __init__(self, song_id, title, img_file, artists, spotify_uri, genres, explicit, duration, preview_url):
        self.song_id = song_id
        self.title = title
        self.img_file = img_file
        self.artists = artists.split(', ')
        self.spotify_uri = spotify_uri
        self.genres = genres.split(', ')
        self.explicit = explicit
        self.duration = duration
        self.preview_url = preview_url

    def to_json(self):
        return json.dumps(self.__dict__)

class Playlist:
    def __init__(self):
        self.playlist = []
        self.number_of_users = {}

    def append(self, song):
        if song.song_id not in self.number_of_users.keys():
            self.number_of_users[song.song_id] = 1
            self.playlist.append(song)
        else:
            self.number_of_users[song.song_id] += 1

    def to_json(self):
        return json.dumps({
            'playlist': [
                {'song': song.to_json(), 'number_of_users': self.number_of_users[song.song_id]} for song in self.playlist
            ]
        })
