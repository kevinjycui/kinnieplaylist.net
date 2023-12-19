import json

class Vote:
    def __init__(self, character, song, user_id):
        self.song = song
        self.character = character
        self.user_id = user_id

    def to_json(self):
        return json.dumps({
            'user_id': self.user_id,
            'character': self.character.to_json(),
            'song': self.song.to_json()
        })

class AnonVote:
    def __init__(self, character, song):
        self.song = song
        self.character = character

    def to_json(self):
        return json.dumps({
            'character': self.character.to_json(),
            'song': self.song.to_json()
        })

class VoteList:
    def __init__(self, votes):
        self.votes = votes

    def to_json(self):
        return {'votes': [vote.to_json() for vote in self.votes]}
