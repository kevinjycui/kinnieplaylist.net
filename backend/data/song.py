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

class CompactPlaylist(Playlist):
    def __init__(self, playlist):
        super().__init__()
        for song_id in playlist:
            self.append(song_id)

    def append(self, song_id):
        if song_id not in self.playlist:
            self.number_of_users[song_id] = 1
            self.playlist.append(song_id)
        else:
            self.number_of_users[song_id] += 1

    def to_json(self, counted=True):
        if counted:
            return json.dumps({
                'playlist': [
                    {'song_id': song_id, 'number_of_users': self.number_of_users[song_id]} for song_id in self.playlist
                ]
            })
        else:
            return json.dumps({'playlist': self.playlist})
