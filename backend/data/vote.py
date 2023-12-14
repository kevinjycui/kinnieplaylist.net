import json

class Vote:
    def __init__(self, character_id, song_id, user_id):
        self.song_id = song_id
        self.character_id = character_id
        self.user_id = user_id

    def to_json(self):
        return json.dumps(self.__dict__)

class AnonVote:
    def __init__(self, character_id, song_id):
        self.song_id = song_id
        self.character_id = character_id

    def to_json(self):
        return json.dumps(self.__dict__)

class VoteList:
    def __init__(self, votes):
        self.votes = votes

    def to_json(self):
        return {'votes': [vote.to_json() for vote in self.votes]}
