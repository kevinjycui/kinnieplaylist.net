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

cur.execute('CREATE OR REPLACE DATABASE kinnieplaylist')

cur.execute('USE kinnieplaylist')

cur.execute('''CREATE OR REPLACE TABLE characters 
                    (character_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
                    name VARCHAR(255),
                    img_file VARCHAR(255),
                    media VARCHAR(255),
                    path VARCHAR(255),

                    UNIQUE KEY(path)
                    PRIMARY KEY(character_id))''')

cur.execute('''INSERT INTO characters SET
                    character_id = 1,
                    name = \'Shinji Ikari\',
                    img_file = \'ikari-shinji.jfif\',
                    media = \'Neon Genesis Evangelion\',
                    path = \'Shinji_Ikari\'''')

cur.execute('''INSERT INTO characters SET
                    character_id = 2,
                    name = \'Kaworu Nagisa\',
                    img_file = \'nagisa-kaworu.jfif\',
                    media = \'Neon Genesis Evangelion\',
                    path = \'Kaworu_Nagisa\'''')

cur.execute('''INSERT INTO characters SET
                    character_id = 3,
                    name = \'Rei Ayanami\',
                    img_file = \'ayanami-rei.jfif\',
                    media = \'Neon Genesis Evangelion\',
                    path = \'Rei_Ayanami\'''')

cur.execute('''INSERT INTO characters SET
                    character_id = 4,
                    name = \'Asuka Langley\',
                    img_file = \'asuka-langley.jfif\',
                    media = \'Neon Genesis Evangelion\',
                    path = \'Asuka_Langley\'''')

cur.execute('''INSERT INTO characters SET
                    character_id = 5,
                    name = \'Misato Katsuragi\',
                    img_file = \'katsuragi-misato.jfif\',
                    media = \'Neon Genesis Evangelion\',
                    path = \'Misato_Katsuragi\'''')

cur.execute('''INSERT INTO characters SET
                    character_id = 6,
                    name = \'Ritsuko Akagi\',
                    img_file = \'akagi-ritsuko.jfif\',
                    media = \'Neon Genesis Evangelion\',
                    path = \'Ritsuko_Akagi\'''')

cur.execute('''INSERT INTO characters SET
                    character_id = 7,
                    name = \'Maya Ibuki\',
                    img_file = \'ibuki-maya.jfif\',
                    media = \'Neon Genesis Evangelion\',
                    path = \'Maya_Ibuki\'''')

cur.execute('''INSERT INTO characters SET
                    character_id = 8,
                    name = \'Gendo Ikari\',
                    img_file = \'ikari-gendo.jfif\',
                    media = \'Neon Genesis Evangelion\',
                    path = \'Gendo_Ikari\'''')

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
cur.execute('GRANT SELECT ON kinnieplaylist.* TO user')
cur.execute('GRANT INSERT ON kinnieplaylist.songs TO user')
cur.execute('GRANT INSERT ON kinnieplaylist.character_song_connections TO user')
cur.execute('GRANT DELETE ON kinnieplaylist.character_song_connections TO user')
