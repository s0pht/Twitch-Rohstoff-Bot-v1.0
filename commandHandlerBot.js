const tmi = require('tmi.js');
const sqlite3 = require('sqlite3').verbose();




let db = new sqlite3.Database('test.db');

// Rohstoffe laden


// Define configuration options
const opts = {
  identity: {
    username: 'shanks_onepiece',
    password: 'oauth:fjk4sasdwwg23zfp9x3972oeob0dfx'
  },
  channels: [
    's0pht'
  ]
};




// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('connected', onConnectedHandler);



// Connect to Twitch:
client.connect();


client.on("chat", (channel, user, message) => {
      

      let target = 's0pht'
      var user = user.username;
      let wert = 0.00;
  // berry checken
  if (message === '!berry'){
    
    let sql = `SELECT *
      FROM bargeldTable
      WHERE name= ?`;

    db.get(sql, user, (err, row) => {
      if (err) {
      return console.error(err.message);
      }
      
      if (row === undefined){
        db.run(`INSERT INTO bargeldTable VALUES(?,?)`,user ,wert , function(err) {
          if (err) {
            return console.log(err.message);
          }
         
          client.say(target, `0 Berry`)
          console.log(`${user} angelegt`)
        
        })
      }
      else {
        client.say(target, `${row.points} Berry`)
      }
      return row
      
  });


  // Rohstoffe checken
  }
  // rohstoff checken
  if (message === '!rohstoffe'){

    let sql = `SELECT *
      FROM rohstoffe`;
    db.all(sql, (err, row) => {
      

      
      client.say('s0pht',row[0]['name'] + ' : ' + row[0]['preis'] + ' | ' +
                        row[1]['name'] + ' : ' + row[1]['preis'] + ' | ' +
                        row[2]['name'] + ' : ' + row[2]['preis'] + ' | ' +
                        row[3]['name'] + ' : ' + row[3]['preis'] + ' | ' +
                        row[4]['name'] + ' : ' + row[4]['preis'] + ' | ' +
                        row[5]['name'] + ' : ' + row[5]['preis'] + ' | ' +
                        row[6]['name'] + ' : ' + row[6]['preis'])
    })
    
  }
  // kaufen funktion
  if (message.startsWith('!buy')){
    var a = message.split(/\s+/).slice(0,3);
    if (a.length < 3){
      
      client.say(target,'Bitte !buy <Rohstoff> <Anzahl> eingeben');
      
      
    } 
    if (isNaN(parseInt(a[1])) == false  ){
      // sql query ob der user ueberhaupt kaufen kann mit sienem geld also brauchen wir das momentane geld und vergleichen mit dem preis mal anzahl vom rohstoff
       var anzahlRohstoff = parseInt(a[1])
       var rohstoffString = a[2];

       if (rohstoffString === 'holz' || rohstoffString === 'getreide' ||rohstoffString === 'stein' ||rohstoffString === 'eisen' ||rohstoffString === 'kupfer' ||rohstoffString === 'gold' ||rohstoffString === 'diamand'){

          let sql = 'SELECT points FROM bargeldTable WHERE name=?'
                db.get(sql,user, function(err, row) {
                  
                  berryUser = row.points;
                  
                  let sql = 'SELECT preis FROM rohstoffe WHERE name=?';
                    // rohstoffpreis 
                    db.get(sql,rohstoffString,function(err,row){
                      
                      preisEinzeln = row.preis;
                      
                      preisGesamt = preisEinzeln * anzahlRohstoff;
                      
                      if (preisGesamt <= berryUser) {

                        

                        // handel anpassen, bargeld updaten.
                        let sql = 'UPDATE bargeldTable SET points =? WHERE name=?'
                        db.run(sql, berryUser - preisGesamt,user, function(err){
                          // schauen ob in handel ein eintrag existiert, wenn nicht dann anlegen, wenn ja dann update (anzahl nicht vergessen)
                          let sql = 'SELECT * FROM handel WHERE user=? AND rohstoff=?'
                          db.get(sql,user,rohstoffString,function(err,row){
                            
                            if (row === undefined){
                              // hier wird inserted
                              let sql = 'INSERT INTO handel VALUES(?,?,?)'
                              db.run(sql,user,anzahlRohstoff,rohstoffString,function(err,row){
                                client.say(target,anzahlRohstoff + " " + rohstoffString + ' für insgesamt ' + preisGesamt + ' Berry gekauft (' + preisEinzeln + '/' + rohstoffString + ')');
                                client.whisper(target,anzahlRohstoff + " " + rohstoffString + ' für insgesamt ' + preisGesamt + ' Berry gekauft (' + preisEinzeln + '/' + rohstoffString + ')');
                              })
                            }
                            else {
                              // hier wird geupdated
                              var anzahl = row.anzahl;
                              let sql = 'UPDATE handel SET anzahl=? WHERE user=? AND rohstoff=?'
                              db.run(sql,anzahl + anzahlRohstoff,user,rohstoffString,function(err,row){
                                client.whisper(target,anzahlRohstoff + " " + rohstoffString + ' für insgesamt ' + preisGesamt + ' Berry gekauft (' + preisEinzeln + '/' + rohstoffString + ')');
                                client.say(target,anzahlRohstoff + " " + rohstoffString + ' für insgesamt ' + preisGesamt + ' Berry gekauft (' + preisEinzeln + '/' + rohstoffString + ')');
                              })
                            }
                          })
                        });

                      }

                      if (preisGesamt > berryUser){
                        client.say(target,'Du hast nicht genügend Berry')
                      }
                    });
                    
                  });


       }

       else {
          client.say(target,'Bitte gültigen Rohstoff eingeben')

       }
       // bargeld User
       
        

      }
    

  }
  // verkaufen Funktion
  if (message.startsWith('!sell')){
    var a = message.split(/\s+/).slice(0,3);
    if (a.length < 3){
      
      client.say(target,'Bitte !sell <Rohstoff> <Anzahl> eingeben');
      
      
    } 
    if (isNaN(parseInt(a[1])) == false  ){
      // schauen ob user ueberhaupt rohstoffe besitzt, danach bargeldTable und Handel updaten
      




       var anzahlRohstoff = parseInt(a[1])
       var rohstoffString = a[2];

       if (rohstoffString === 'holz' || rohstoffString === 'getreide' ||rohstoffString === 'stein' ||rohstoffString === 'eisen' ||rohstoffString === 'kupfer' ||rohstoffString === 'gold' ||rohstoffString === 'diamand'){


          let sql = 'SELECT * FROM handel WHERE user=? AND rohstoff=?'
          
          db.get(sql,user,rohstoffString,function(err,row){

            if (row === undefined || row.anzahl === 0){
              client.say(target,'Du besitzt den Rohstoff ' + rohstoffString + ' nicht.')
            }
            else{

              // nachdem keine rohstoffe ausgeschlossen wurden muss nun untersucht werden ob die anzahl der rohstoffe die man verkaufen will kleiner gleich der der vorhandenen ist

              let sql = 'SELECT * FROM handel WHERE user=? AND rohstoff=?'
              db.get(sql,user,rohstoffString,function(err,row){
                var anzahl = row.anzahl
                if (anzahlRohstoff > anzahl){
                  client.say(target,'So viele Rohstoffe besitzt du nicht')
                }
                else {
                  //update bargeld und handel

                  //bargeld 
                  let sql = 'SELECT points FROM bargeldTable WHERE name=?'
                  db.get(sql,user, function(err, row) {
                  
                  berryUser = row.points;
                  
                  let sql = 'SELECT preis FROM rohstoffe WHERE name=?';
                  // rohstoffpreis 
                  db.get(sql,rohstoffString,function(err,row){
                    
                    preisEinzeln = row.preis;
                    
                    preisGesamt = preisEinzeln * anzahlRohstoff;
                    
                    let sql = 'UPDATE bargeldTable SET points =? WHERE name=?'
                        db.run(sql, berryUser + preisGesamt,user, function(err){

                          let sql = 'UPDATE handel SET anzahl=? WHERE user=? AND rohstoff=?'
                              db.run(sql,anzahl - anzahlRohstoff,user,rohstoffString,function(err,row){

                                client.whisper(target,anzahlRohstoff + " " + rohstoffString + ' für insgesamt ' + preisGesamt + ' Berry verkauft (' + preisEinzeln + '/' + rohstoffString + ')');
                                client.say(target,anzahlRohstoff + " " + rohstoffString + ' für insgesamt ' + preisGesamt + ' Berry verkauft (' + preisEinzeln + '/' + rohstoffString + ')');

                              })

                        })
                    

                  })


                  })

                }


              })




            }

          })

       }

       else {
          client.say(target,'Bitte gültigen Rohstoff eingeben')

       }
       // bargeld User
       
        

      }
    

  }
  // Inventar checken
  if (message === '!inventar'){

    let sql = 'SELECT * FROM handel WHERE user=?'

    db.all(sql,user,function(err,row) {
      var a = '';
      for (i in row){
        
        a += row[i].anzahl + ' ' + row[i].rohstoff + ' | '
      }
      client.say(target,a)

    })
  }
  // Berry senden
  if (message.startsWith('!senden')){
    var a = message.split(/\s+/).slice(0,3);
    if (a.length < 3){
      
      client.say(target,'Bitte !senden <berry> <empfaenger> eingeben');
    }

    if (isNaN(parseInt(a[1])) == false  ){
      let sql = 'SELECT * FROM bargeldTable WHERE name=?'
      db.get(sql,a[2],function(err,row){
                            
      if (row === undefined){
        client.say(target,'Den User ' + a[2] + ' gibt es nicht')
      }
      else {
        // Berry von sender checken und vergleichen mit a2 
        let sql = 'SELECT points FROM bargeldTable WHERE name=?'
        db.get(sql,user,function(err,row){
          anzahl = a[1]
          anzahlBargeld = row.points

          if (anzahl > anzahlBargeld){
            client.say(target,'So viele Berry hast du nicht')
          }
          else {
            // neues bargeld sender
            bargeldSender = anzahlBargeld - anzahl
            let sql = 'UPDATE bargeldTable SET points=? WHERE name=?'
            db.run(sql,bargeldSender,user,rohstoffString,function(err,row){
              // bargeld von empfaenger herausfinden und updaten
              let sql = 'SELECT points FROM bargeldTable WHERE name=?'
              db.get(sql,a[2],function(err,row){
                var berryEmpfaenger = parseFloat(row.points)
                var neuBerryEmpfaenger = berryEmpfaenger + parseFloat(a[1])
                
                let sql = 'UPDATE bargeldTable SET points=? WHERE name=?'
                db.run(sql,neuBerryEmpfaenger,a[2],function(err,row){
                  client.say(target, a[1] + ' Berry an ' + a[2] + ' transferiert')
                })
              })

            })
            
          }

        })
      }
      })
    }
    if (isNaN(parseInt(a[1])) == true) {
      client.say(target,'Bitte !senden <berry> <empfaenger> eingeben');
    }


  }
  // gamble
  if (message.startsWith('!gamble')){
    client.say(target,'gamblen kommt bald!')
  }
})




// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}


// check if user in database, if not insert.


