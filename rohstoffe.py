import sqlite3
import schedule
import random
import sys
import gc
import socket


  


def rohstoffe():
    
    connection = sqlite3.connect('test.db')
    cursor = connection.cursor()

    rohstoffe = 'CREATE TABLE IF NOT EXISTS rohstoffe(name text,preis FLOAT)'
    cursor.execute(rohstoffe)
    
    handel = 'CREATE TABLE IF NOT EXISTS handel(user text,anzahl INTEGER,rohstoff text)'
    cursor.execute(handel)
    # Rohstoffe anlegen

    def holz():
        
        stoff = 'holz'
        cursor.execute('SELECT * FROM rohstoffe WHERE name=?',(stoff,))

        entryKonto = cursor.fetchone()

        if entryKonto is None:
            cursor.execute('INSERT INTO rohstoffe VALUES (?,?)', (stoff,5))
            connection.commit()
        else:
            pass
    def getreide():
        
        stoff = 'getreide'
        cursor.execute('SELECT * FROM rohstoffe WHERE name=?',(stoff,))

        entryKonto = cursor.fetchone()

        if entryKonto is None:
            cursor.execute('INSERT INTO rohstoffe VALUES (?,?)', (stoff,20))
            connection.commit()
        else:
            pass
    def stein():
    
        stoff = 'stein'
        cursor.execute('SELECT * FROM rohstoffe WHERE name=?',(stoff,))

        entryKonto = cursor.fetchone()

        if entryKonto is None:
            cursor.execute('INSERT INTO rohstoffe VALUES (?,?)', (stoff,50))
            connection.commit()
        else:
            pass
    def eisen():
        
        stoff = 'eisen'
        cursor.execute('SELECT * FROM rohstoffe WHERE name=?',(stoff,))

        entryKonto = cursor.fetchone()

        if entryKonto is None:
            cursor.execute('INSERT INTO rohstoffe VALUES (?,?)', (stoff,100))
            connection.commit()
        else:
            pass
    def kupfer():
        
        stoff = 'kupfer'
        cursor.execute('SELECT * FROM rohstoffe WHERE name=?',(stoff,))

        entryKonto = cursor.fetchone()

        if entryKonto is None:
            cursor.execute('INSERT INTO rohstoffe VALUES (?,?)', (stoff,200))
            connection.commit()
        else:
            pass
    def gold():
        
        stoff = 'gold'
        cursor.execute('SELECT * FROM rohstoffe WHERE name=?',(stoff,))

        entryKonto = cursor.fetchone()

        if entryKonto is None:
            cursor.execute('INSERT INTO rohstoffe VALUES (?,?)', (stoff,1000))
            connection.commit()
        else:
            pass
    def diamant():
        
        stoff = 'diamant'
        cursor.execute('SELECT * FROM rohstoffe WHERE name=?',(stoff,))

        entryKonto = cursor.fetchone()

        if entryKonto is None:
            cursor.execute('INSERT INTO rohstoffe VALUES (?,?)', (stoff,5000))
            connection.commit()
        else:
            pass

    holz()
    getreide()
    stein()
    eisen()
    kupfer()
    gold()
    diamant()    

    def aktualisiereRohstoffe():

        holz = round(random.uniform(5,20), 2)
        getreide = round(random.uniform(10,30), 2)
        stein = round(random.uniform(20,70), 2)
        eisen = round(random.uniform(50,150), 2)
        kupfer = round(random.uniform(150,250), 2)
        gold = round(random.uniform(500,1500), 2)
        diamant = round(random.uniform(2500,7500), 2)

        cursor.execute("UPDATE rohstoffe SET preis=? WHERE name=?", (holz,'holz'))
        connection.commit()

        cursor.execute("UPDATE rohstoffe SET preis=? WHERE name=?", (getreide,'getreide'))
        connection.commit()

        cursor.execute("UPDATE rohstoffe SET preis=? WHERE name=?", (stein,'stein'))
        connection.commit()

        cursor.execute("UPDATE rohstoffe SET preis=? WHERE name=?", (eisen,'eisen'))
        connection.commit()

        cursor.execute("UPDATE rohstoffe SET preis=? WHERE name=?", (kupfer,'kupfer'))
        connection.commit()

        cursor.execute("UPDATE rohstoffe SET preis=? WHERE name=?", (gold,'gold'))
        connection.commit()

        cursor.execute("UPDATE rohstoffe SET preis=? WHERE name=?", (diamant,'diamant'))
        connection.commit()

        file = open('rohstoff.txt','w') 
        file.write("Holz: " + str(holz)) 
        file.write("\nGetreide: " + str(getreide))
        file.write("\nStein: " + str(stein))
        file.write("\nEisen: " + str(eisen))
        file.write("\nKupfer: " + str(kupfer))
        file.write("\nGold: " + str(gold))
        file.write("\nDiamant: " + str(diamant))

        gc.collect()

    aktualisiereRohstoffe()
    

    

    




