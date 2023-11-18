import json

class Character:
    def __init__(self, character_id, name, img_file, media, external_url):
        self.character_id = character_id
        self.name = name
        self.img_file = img_file
        self.media = media
        self.external_url = external_url

    def to_json(self):
        return json.dumps(self.__dict__)

class CharacterList:
    def __init__(self, characters):
        self.characters = characters

    def to_json(self):
        return [character.to_json() for character in self.characters]
    