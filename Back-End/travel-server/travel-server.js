const expr = require('express');
const pgp = require("pg-promise")();
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.post('/addTravel', jsonParser, function (req,res) {
    console.log('Post /addTravel');
    var name = req.body.name;
    var daily_budget = req.body.daily_budget;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var destination = req.body.destination;
    var description = req.body.description;
    var user = req.body.user;
    db.query("INSERT INTO travel VALUES ($1,$2,$3,$4,$5,$6,$7)", [daily_budget,start_date,end_date,destination,description,user,name])
        .then(res.send({status: true, msg:"ok"}))
        .catch(err => {
            console.log(err);
            return res.send({status: false, msg: "error"})
        })
});


app.post('/deleteTravel', jsonParser, function (req,res) {
    console.log('Post /deleteTravel');
    var name = req.body.name;
    var token = req.body.token;
    try{
        const decode = jwt.verify(token, 'testkey');
        email = decode.email;
        db.query("DELETE FROM expense WHERE travel = $1", [name])
            .then(
                db.query("DELETE FROM travel WHERE name = $1 AND travel.user = $2", [name,email])
                    .then(res.send({status: true, msg:"ok"}))
                    .catch(err => {
                        console.log(err);
                        return res.send({status: false, msg: "error"})
                    })
            )
            .catch(err => {
                console.log(err);
                return res.send({status: false, msg: "error"})
            })
    }catch(error) {
        console.log(error);
        return res.send({status: false, msg:"error"});
    }
})

app.post('/completeTravel', jsonParser, function (req,res) {
    console.log('Post /completeTravel');
    var name = req.body.travel;
    var userToken = req.body.userToken;
    try{
        const decode = jwt.verify(userToken, 'testkey');
        email = decode.email;
        end_date = new Date();
        db.query("UPDATE travel SET end_date=$1 WHERE name=$2 AND travel.user=$3", [end_date, name, email])
            .then(res.send({status: true, msg:"ok"}))
            .catch(err => {
                console.log(err);
                return res.send({status: false, msg: "error"})
            });
    }catch(error) {
        console.log(error);
        return res.send({status: false, msg:"error"});
    }
})

app.post('/travels', jsonParser, function (req,res) {
    token = req.body.token;
    console.log("Post /travels");
    try{
        const decode = jwt.verify(token, 'testkey');
        email = decode.email;
        db.query("SELECT name FROM travel WHERE travel.user = $1", [email])
            .then(result => {
                res.send(result);
            })
            .catch(err => {
                console.log(err);
                return res.send({status: false, msg: "error"})
            })
    }catch(error) {
        console.log(error);
        return res.send({status: false, msg:"error"});
    }
});

//Ritorna tutte le expense di un travel (serve solo per testare)
app.get('/allExpenses', function(req,res) {
    db.query("SELECT name FROM expense").then(result => {
        res.send(result)
    })
});

app.post('/days', jsonParser, function (req,res) {
    console.log("Post /days");
    var travel_name = req.body.name;
    db.query("SELECT DISTINCT date FROM expense WHERE expense.travel = $1", [travel_name]).then(result => {
        res.send(result);
    })
});

app.post('/addExpense', jsonParser, function(req,res){
    console.log("Post /addExpense");
    var name = req.body.name;
    var amount = req.body.amount;
    var category = req.body.category;
    var place = req.body.place;
    var date = req.body.date;
    var travel = req.body.travel;
    db.query("INSERT INTO expense VALUES ($1,$2,$3,$4,$5,$6)", [name,amount,category,place,date,travel]).then(
        res.send('SUCCESS')
    )
});

app.post('/deleteExpense', jsonParser, function (req,res) {
    console.log("Post /deleteExpense");
    var expense_name = req.body.name;
    var travel_name = req.body.travel;
    db.query("DELETE FROM expense WHERE expense.name = $1 AND expense.travel = $2", [expense_name, travel_name]).then(
        res.send("SUCCESS"));
});


app.post('/dayTravel', jsonParser, function(req,res) {
    console.log("Post /dayTravel");
    var travel_name = req.body.name;
    var date = req.body.date;
    db.query("SELECT name, amount, category, place FROM expense WHERE expense.travel = $1 AND expense.date = $2", [travel_name, date]).then(result => {
        res.send(result)
    })
})

app.listen(3002, () => {
    console.log('Listening on port: ' + 3002);
});