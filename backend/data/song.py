import json

class Song:
    def __init__(self, song_id, title, img_file, artists, genres, explicit, duration):
        self.song_id = song_id
        self.title = title
        self.img_file = img_file
        self.artists = artists
        self.genres = genres
        self.explicit = explicit
        self.duration = duration

    def to_json(self):
        return json.dumps(self.__dict__)

class Playlist:
    def __init__(self, playlist):
        self.playlist = playlist

    def to_json(self):
        return json.dumps({
            'playlist': self.playlist
        })

class CountedPlaylist:
    def __init__(self, playlist):
        self.playlist = playlist

    def to_json(self):
        return json.dumps({
            'playlist': [
                {'song_id': song_id, 'number_of_users': number_of_users} for song_id, number_of_users in self.playlist
            ]
        })
