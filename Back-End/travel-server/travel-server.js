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
var jsonParser = bodyParser.json()

app.post('/addTravel', jsonParser, function (req,res) {
    var name = req.body.name;
    var daily_budget = req.body.daily_budget;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var destination = req.body.destination;
    var description = req.body.description;
    var customer = req.body.customer;
    db.query("INSERT INTO travel VALUES ($1,$2,$3,$4,$5,$6,$7)", [daily_budget,start_date,end_date,destination,description,customer,name])
})

app.listen(3002, () => {
    console.log('Listening on port: ' + 3002);
})