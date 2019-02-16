const sqlite3 = require('sqlite3').verbose();


let sql = 'SELECT points FROM bargeldTable WHERE name=?'
let db = new sqlite3.Database('test.db');




db.get(sql,'s0pht', function(err, row) {
    
    row = row.points;
    callback(row);
});

var test = undefined;

function callback(row) {
    var test = row;
}

console.log(test)
