import sqlite3
import requests
import schedule
import gc

def auto():
    connection = sqlite3.connect('test.db')
    cursor = connection.cursor()

    kontoTable = 'CREATE TABLE IF NOT EXISTS kontoTable(name text,points FLOAT)'
    cursor.execute(kontoTable)

    bargeldTable = 'CREATE TABLE IF NOT EXISTS bargeldTable(name text,points FLOAT)'
    cursor.execute(bargeldTable)



    def autoCurrency():

        
        r = requests.get('http://tmi.twitch.tv/group/user/s0pht/chatters')
        r.encoding
        test = r.json()
        banned = {'bots':['freast',
                            'nightbot',
                            'commanderroot',
                            'apricotdrupefruit',
                            'electricallongboard',
                            'host_giveaway',
                            'p0lizei_',
                            'p0sitivitybot',
                            'skinnyseahorse',
                            'slocool',
                            'activeenergy',
                            'moobot']}

        listBanned = banned['bots']
        listViewer = test['chatters']['viewers']
        
        listMods = test['chatters']['moderators']
        listVips = test['chatters']['vips']
        listStreamer = test['chatters']['broadcaster']

        # loescht alle Bots und co
        for i in listBanned:
            if i in listViewer:

                listViewer.remove(i)

            if i in listMods:

                listMods.remove(i)
            if i in listVips:  

                listVips.remove(i)

        def anlegen(i):
            cursor.execute('SELECT * FROM kontoTable WHERE name=?',(i,))

            entryKonto = cursor.fetchone()

            if entryKonto is None:
                cursor.execute('INSERT INTO kontoTable VALUES (?,?)', (i,0))
                connection.commit()
                print(i)
            else:
                pass

            cursor.execute('SELECT * FROM bargeldTable WHERE name=?',(i,))

            entryBargeld = cursor.fetchone()

            if entryBargeld is None:
                cursor.execute('INSERT INTO bargeldTable VALUES (?,?)', (i,0))
                connection.commit()
            else:
                pass
            
            gc.collect()

        def punkteDazu(i):

            pointsBargeld = cursor.execute('SELECT points FROM bargeldTable WHERE name=?', (i,))
        
            for b in pointsBargeld:
                bargeld = b[0]


            a = bargeld
            b = 2
            ergebnis = a + b 
            cursor.execute("UPDATE bargeldTable SET points=? WHERE name=?", (ergebnis,i))
            connection.commit()

            gc.collect()

        for i in listViewer:
            anlegen(i)
            punkteDazu(i)
            
            
        for i in listMods:
            anlegen(i)
            punkteDazu(i)
                
        for i in listVips:
            anlegen(i)
            punkteDazu(i)

        for i in listStreamer:
            anlegen(i)
            punkteDazu(i)
        gc.collect()
    autoCurrency()
        
   
    


    


        