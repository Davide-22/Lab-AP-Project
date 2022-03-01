const expr = require('express');
const pgp = require("pg-promise")();
var bodyParser = require('body-parser');

const cn = {
    host: 'localhost',
    port: 5432,
    database: 'Progetto',
    user: 'postgres',
    password: 'Stefano25'
};
const db = pgp(cn);
const app = expr();
var jsonParser = bodyParser.json();

app.post('/addTravel', jsonParser, function (req,res) {
    var name = req.body.name;
    var daily_budget = req.body.daily_budget;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var destination = req.body.destination;
    var description = req.body.description;
    var customer = req.body.customer;
    db.query("INSERT INTO travel VALUES ($1,$2,$3,$4,$5,$6,$7)", [daily_budget,start_date,end_date,destination,description,customer,name]).then(
        res.send('SUCCESS')
    )
});

app.get('/travels', function(req,res) {
    db.query("SELECT name FROM travel").then(result => {
        res.send(result)
    })
});

app.post('/deleteTravel', jsonParser, function (req,res) {
    var name = req.body.name;
    db.query("DELETE FROM travel WHERE travel.name = $1", [name]).then(res.send("SUCCESS"));
})

app.listen(3002, () => {
    console.log('Listening on port: ' + 3002);
});