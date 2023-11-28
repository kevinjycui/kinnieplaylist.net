import sys

import mysql.connector
import yaml

if __name__ != '__main__':
    sys.exit()

with open('config.yml', 'r') as file:
    config = yaml.safe_load(file)

conn = mysql.connector.connect(
    host = config['mysql']['host'],
    port = config['mysql']['port'],
    user = config['mysql']['user'],
    password = config['mysql']['password'])

def sql_run_logged(cmd):
    print(cmd, end=';\n')
    cur = conn.cursor()
    cur.execute(cmd)

sql_run_logged('DROP DATABASE IF EXISTS kinnie')
sql_run_logged('CREATE DATABASE kinnie')

sql_run_logged('USE kinnie')

sql_run_logged('''CREATE TABLE characters 
                    (character_id VARCHAR(255) NOT NULL,
                    name VARCHAR(255),
                    img_file VARCHAR(255),
                    media VARCHAR(255),

                    PRIMARY KEY(character_id))
                 CHARACTER SET utf8 COLLATE utf8_unicode_ci''')

sql_run_logged('''CREATE TABLE songs 
                    (song_id VARCHAR(255),
                    title VARCHAR(255), 
                    img_file VARCHAR(255), 
                    artists VARCHAR(255),
                    genres VARCHAR(255),
                    explicit BOOL,
                    duration INT,

                    PRIMARY KEY(song_id))
                 CHARACTER SET utf8 COLLATE utf8_unicode_ci''')

sql_run_logged('''CREATE TABLE character_song_connections 
                    (song_id VARCHAR(255),
                    character_id VARCHAR(255),
                    user_id VARCHAR(255))''')

sql_run_logged('CREATE USER user')
sql_run_logged('GRANT SELECT ON kinnie.* TO user')
sql_run_logged('GRANT INSERT ON kinnie.songs TO user')
sql_run_logged('GRANT INSERT ON kinnie.character_song_connections TO user')
sql_run_logged('GRANT DELETE ON kinnie.character_song_connections TO user')

conn.commit()
