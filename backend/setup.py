import sys

import mariadb
import yaml

if __name__ != '__main__':
    sys.exit()

with open('config.yml', 'r') as file:
    config = yaml.safe_load(file)

conn = mariadb.connect(
    host = config['mariadb']['host'],
    port = config['mariadb']['port'],
    user = config['mariadb']['user'],
    password = config['mariadb']['password'])

def sql_run_logged(cmd):
    print(cmd, end=';\n')
    cur = conn.cursor()
    cur.execute(cmd)

sql_run_logged('CREATE OR REPLACE DATABASE kinnie')

sql_run_logged('USE kinnie')

sql_run_logged('''CREATE OR REPLACE TABLE characters 
                    (character_id VARCHAR(255) NOT NULL,
                    name VARCHAR(255),
                    img_file VARCHAR(255),
                    media VARCHAR(255),

                    PRIMARY KEY(character_id))
                 CHARACTER SET utf8 COLLATE utf8_unicode_ci''')

sql_run_logged('''INSERT INTO characters SET
                    character_id = \'Shinji_Ikari\',
                    name = \'Shinji Ikari\',
                    img_file = \'https://i.imgur.com/3m1mVBm.jpg\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''INSERT INTO characters SET
                    character_id = \'Kaworu_Nagisa\',
                    name = \'Kaworu Nagisa\',
                    img_file = \'https://i.imgur.com/0sJd9Tt.jpg\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''INSERT INTO characters SET
                    character_id = \'Rei_Ayanami\',
                    name = \'Rei Ayanami\',
                    img_file = \'https://i.imgur.com/EVvuDSU.jpg\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''INSERT INTO characters SET
                    character_id = \'Asuka_Langley\',
                    name = \'Asuka Langley\',
                    img_file = \'https://i.imgur.com/sZUj5BJ.jpg\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''INSERT INTO characters SET
                    character_id = \'Misato_Katsuragi\',
                    name = \'Misato Katsuragi\',
                    img_file = \'katsuragi-misato.jfif\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''INSERT INTO characters SET
                    character_id = \'Ritsuko_Akagi\',
                    name = \'Ritsuko Akagi\',
                    img_file = \'akagi-ritsuko.jfif\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''INSERT INTO characters SET
                    character_id = \'Maya_Ibuki\',
                    name = \'Maya Ibuki\',
                    img_file = \'ibuki-maya.jfif\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''INSERT INTO characters SET
                    character_id = \'Gendo_Ikari\',
                    name = \'Gendo Ikari\',
                    img_file = \'ikari-gendo.jfif\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''CREATE OR REPLACE TABLE songs 
                    (song_id VARCHAR(255),
                    title VARCHAR(255), 
                    img_file VARCHAR(255), 
                    artists VARCHAR(255),
                    genres VARCHAR(255),
                    explicit BOOL,
                    duration INT,

                    PRIMARY KEY(song_id))
                 CHARACTER SET utf8 COLLATE utf8_unicode_ci''')

sql_run_logged('''CREATE OR REPLACE TABLE character_song_connections 
                    (song_id VARCHAR(255),
                    character_id VARCHAR(255),
                    user_id VARCHAR(255))''')

sql_run_logged('CREATE OR REPLACE USER user')
sql_run_logged('GRANT SELECT ON kinnie.* TO user')
sql_run_logged('GRANT INSERT ON kinnie.songs TO user')
sql_run_logged('GRANT INSERT ON kinnie.character_song_connections TO user')
sql_run_logged('GRANT DELETE ON kinnie.character_song_connections TO user')

conn.commit()
