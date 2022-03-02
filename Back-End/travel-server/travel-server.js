const expr = require('express');
const pgp = require("pg-promise")();
var bodyParser = require('body-parser');

const cn = {
    host: 'localhost',
    port: 5432,
    database: '',
    user: 'postgres',
    password: ''
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

//Ritorna tutte le expense di un travel (serve solo per testare)
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

app.post('/deleteExpense', jsonParser, function (req,res) {
    var expense_name = req.body.expense_name;
    var travel_name = req.body.travel_name;
    db.query("DELETE FROM expense WHERE expense.name = $1 AND expense.trip = $2", [expense_name, travel_name]).then(
        res.send("SUCCESS"));
});

//Ritorna tutte le expense di un dato giorno
app.get('/dayTravel', jsonParser, function(req,res) {
    var travel_name = req.body.travel_name;
    var date = req.body.date;
    db.query("SELECT name FROM expense WHERE expense.trip = $1 AND expense.date = $2", [travel_name, date]).then(result => {
        res.send(result)
    })
})

app.listen(3002, () => {
    console.log('Listening on port: ' + 3002);
});