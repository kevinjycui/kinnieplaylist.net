import mariadb
import yaml

if __name__ != '__main__':
    exit()

with open('config.yml', 'r') as file:
    config = yaml.safe_load(file)

conn = mariadb.connect(
    host = config['mariadb']['host'],
    port = config['mariadb']['port'],
    user = config['mariadb']['user'],
    password = config['mariadb']['password'])

cur = conn.cursor()

cur.execute('CREATE OR REPLACE DATABASE mixato')

cur.execute('USE mixato')

cur.execute('''CREATE OR REPLACE TABLE characters 
                    (character_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
                    name VARCHAR(255),
                    img_file VARCHAR(255),
                    media VARCHAR(255),
                    external_url VARCHAR(255),

                    PRIMARY KEY(character_id))''')

cur.execute('''INSERT INTO characters SET
                    character_id = 1,
                    name = \'Shinji Ikari\',
                    img_file = \'\',
                    media = \'Neon Genesis Evangelion\',
                    external_url = \'https://en.wikipedia.org/wiki/Shinji_Ikari\'''')

cur.execute('''CREATE OR REPLACE TABLE songs 
                    (song_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
                    spotify_id VARCHAR(255),
                    title VARCHAR(255), 
                    img_file VARCHAR(255), 
                    artists VARCHAR(255),
                    spotify_uri VARCHAR(255),
                    genres VARCHAR(255),
                    explicit BOOL,
                    duration INT,
                    preview_url VARCHAR(255),

                    UNIQUE KEY(spotify_id),
                    PRIMARY KEY(song_id))''')

cur.execute('''CREATE OR REPLACE TABLE character_song_connections 
                    (song_id INT,
                    character_id INT,
                    user_id INT)''')

cur.execute('CREATE OR REPLACE USER user')
cur.execute('GRANT SELECT ON mixato.* TO user')
cur.execute('GRANT INSERT ON mixato.songs TO user')
cur.execute('GRANT INSERT ON mixato.character_song_connections TO user')
cur.execute('GRANT DELETE ON mixato.character_song_connections TO user')
