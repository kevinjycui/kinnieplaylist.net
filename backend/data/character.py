import json

class Character:
    def __init__(self, character_id, name, img_file, media, media2):
        self.character_id = character_id
        self.name = name
        self.img_file = img_file
        self.media = media
        if media2 is not None:
            self.media2 = media2

    def to_json(self):
        return json.dumps(self.__dict__)

class CharacterID:
    def __init__(self, character_id):
        self.character_id = character_id

    def to_json(self):
        return json.dumps(self.__dict__)

class CharacterList:
    def __init__(self, characters, total_count=0):
        self.characters = characters
        self.total_count = total_count

    def to_json(self):
        if self.total_count != 0:
            return {'characters': [character.to_json() for character in self.characters], 'total_count': self.total_count}
        return {'characters': [character.to_json() for character in self.characters]}
    
class Media:
    def __init__(self, name, number_of_votes):
        self.name = name
        self.number_of_votes = number_of_votes

    def to_json(self):
        return {'media': self.name, 'number_of_votes': self.number_of_votes}

class MediaList:
    def __init__(self, medias):
        self.medias = medias

    def to_json(self):
        return {'medias': [media.to_json() for media in self.medias]}
