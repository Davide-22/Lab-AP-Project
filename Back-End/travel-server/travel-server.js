const expr = require('express');
const pgp = require("pg-promise")();
var bodyParser = require('body-parser');

const cn = {
    host: 'localhost',
    port: 5432,
    database: 'LabAP',
    user: 'postgres',
    password: 'lolDU56'
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

app.get('/allTravels', function(req,res) {
    db.query("SELECT name FROM travel").then(result => {
        res.send(result)
    })
});

app.post('/deleteTravel', jsonParser, function (req,res) {
    var name = req.body.name;
    db.query("DELETE FROM travel WHERE travel.name = $1", [name]).then(res.send("SUCCESS"));
})

app.post('/completeTravel', jsonParser, function (req,res) {
    var end_date = req.body.end_date;
    var name = req.body.name;
    db.query("UPDATE travel SET end_date=$1 WHERE name=$2", [end_date, name]).then(res.send("SUCCESS"));
})

app.post('/travels', jsonParser, function (req,res) {
    var user = req.body.customer;
    db.query("SELECT name FROM travel WHERE travel.customer = $1", [user]).then(result => {
        res.send(result);
    })
});

//test solo per vedere se funziona correttamente
app.get('/allExpenses', function(req,res) {
    db.query("SELECT name FROM expense").then(result => {
        res.send(result)
    })
});

app.post('/addExpense', jsonParser, function(req,res){
    var name = req.body.name;
    var amount = req.body.amount;
    var category = req.body.category;
    var place = req.body.place;
    var date = req.body.date;
    var trip = req.body.trip;
    db.query("INSERT INTO expense VALUES ($1,$2,$3,$4,$5,$6)", [name,amount,category,place,date,trip]).then(
        res.send('SUCCESS')
    )
});

app.listen(3002, () => {
    console.log('Listening on port: ' + 3002);
});