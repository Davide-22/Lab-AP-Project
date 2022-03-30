const expr = require('express');
const pgp = require("pg-promise")();
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const amqp = require('amqplib/callback_api');

const cn = {
    host: 'postgres',
    port: 5432,
    database: 'LAPdb',
    user: 'postgres',
    password: 'postgres'
};
const db = pgp(cn);
const app = expr();
var jsonParser = bodyParser.json();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  function sendLog(message) {
    console.log(message);
    try{
        amqp.connect('amqp://rabbitmq', function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            var exchange = 'logs';
            var today = new Date();
            var h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();
            channel.assertExchange(exchange, 'fanout', {
                durable: false
            });
            channel.publish(exchange, '', Buffer.from('[travel-server] [' + h + ":" + m + ":" + s + '] ' + message));
        });
        setTimeout(function () {
            connection.close();
        }, 500);
        })
    }catch(error){
        console.log(error);
    }
}

app.post('/addTravel', jsonParser, function (req,res) {
    sendLog('POST /addTravel' + req.body.name);
    var name = req.body.name;
    var daily_budget = req.body.daily_budget;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var destination = req.body.destination;
    var description = req.body.description;
    var user_token = req.body.user_token;
    try {
        const decode = jwt.verify(user_token, 'testkey');
        email = decode.email;
        sendLog('To' + email);
        db.query("INSERT INTO travels VALUES ($1,$2,$3,$4,$5,$6,$7)", [name,email,daily_budget,start_date,end_date,destination,description])
            .then(result => {
                res.send({status: true, msg:"ok"})
            })
            .catch(err => {
                sendLog(err.toString());
                res.send({status: false, msg: "error"})
            })
    }catch(error) {
        sendLog(error.toString());
        return res.send({status: false, msg:"error"});
    }
});


app.post('/deleteTravel', jsonParser, function (req,res) {
    sendLog('POST /deleteTravel'+ req.body.name);
    var name = req.body.name;
    var token = req.body.token;
    try{
        const decode = jwt.verify(token, 'testkey');
        email = decode.email;
            db.query("DELETE FROM travels WHERE name = $1 AND user_email = $2", [name,email])
                    .then(res.send({status: true, msg:"ok"}))
                    .catch(err => {
                        sendLog(err.toString());
                        return res.send({status: false, msg: "error"})
                    })
    }catch(error) {
        sendLog(error.toString());
        return res.send({status: false, msg:"error"});
    }
})

app.post('/completeTravel', jsonParser, function (req,res) {
    sendLog('POST /completeTravel'+req.body.travel);
    var name = req.body.travel;
    var userToken = req.body.userToken;
    var end_date = req.body.date;
    try{
        const decode = jwt.verify(userToken, 'testkey');
        email = decode.email;
        db.query("UPDATE travels SET end_date=$1 WHERE name=$2 AND user_email=$3", [end_date, name, email])
            .then(res.send({status: true, msg:"ok"}))
            .catch(err => {
                sendLog(err.toString());
                return res.send({status: false, msg: "error"})
            });
    }catch(error) {
        sendLog(error.toString());
        return res.send({status: false, msg:"error"});
    }
})

app.post('/travels', jsonParser, function (req,res) {
    token = req.body.token;
    sendLog("POST /travels");
    try{
        const decode = jwt.verify(token, 'testkey');
        email = decode.email;
        db.query("SELECT * FROM travels WHERE user_email = $1 ORDER BY end_date DESC, start_date ASC", [email])
            .then(result => {
                res.send(result);
            })
            .catch(err => {
                sendLog(err.toString());
                return res.send({status: false, msg: "error"})
            })
    }catch(error) {
        sendLog(error.toString());
        return res.send({status: false, msg:"error"});
    }
});

app.post('/days', jsonParser, function (req,res) {
    sendLog("POST /days");
    var travel = req.body.travel;
    token = req.body.token;
    try{
        const decode = jwt.verify(token, 'testkey');
        email = decode.email;
        db.query("SELECT DISTINCT date FROM expenses WHERE user_email = $1 AND travel = $2 order by date ASC", [email, travel]).then(result => {
            res.send(result);
        })
        .catch(err => {
            sendLog(err.toString());
            return res.send({status: false, msg: "error"})
        })
    }catch(error){
        sendLog(error.toString());
        return res.send({status: false, msg:"error"});
    }    
});

app.post('/addExpense', jsonParser, function(req,res){
    sendLog("POST /addExpense");
    var name = req.body.name;
    var amount = req.body.amount;
    var category = req.body.category;
    var place = req.body.place;
    var date = req.body.date;
    var travel = req.body.travel;
    token = req.body.token;
    try{
        const decode = jwt.verify(token, 'testkey');
        email = decode.email;
        db.query("INSERT INTO expenses VALUES ($1,$2,$3,$4,$5,$6,$7)", [email, travel, name, amount, category, date, place]).then(
            res.send({status: true, msg:"ok"})
        )
        .catch(err => {
            sendLog(err.toString());
            return res.send({status: false, msg: "error"})
        })
    }catch(error){
        sendLog(error.toString());
        return res.send({status: false, msg:"error"});
    } 
});

app.post('/deleteExpense', jsonParser, function (req,res) {
    sendLog("POST /deleteExpense");
    var name = req.body.name;
    var travel = req.body.travel;
    token = req.body.token;
    var id = req.body._id
    try{
        const decode = jwt.verify(token, 'testkey');
        email = decode.email;
    }catch(error){
        sendLog(error.toString());
        return res.send({status: false, msg:"error"});
    } 
    db.query("DELETE FROM expenses WHERE user_email = $1 AND travel = $2 and name = $3 and _id = $4", [email, travel, name, id]).then(
        res.send({status: true, msg:"ok"})
    )
    .catch(err => {
        sendLog(err.toString());
        return res.send({status: false, msg: "error"})
    })
});


app.post('/getExpenses', jsonParser, function(req,res) {
    sendLog("POST /getExpenses");
    var travel = req.body.travel;
    var date = req.body.date;
    token = req.body.token;
    try{
        const decode = jwt.verify(token, 'testkey');
        email = decode.email;
        db.query("SELECT * FROM expenses WHERE user_email = $1 AND travel = $2 AND date = $3", [email, travel, date]).then(result => {
            res.send(result);
        })
        .catch(err => {
            sendLog(err.toString());
            return res.send({status: false, msg: "error"})
        })
    }catch(error){
        sendLog(error.toString());
        return res.send({status: false, msg:"error"});
    } 
})

app.post('/Expenses', jsonParser, function(req,res) {
    sendLog("POST /Expenses");
    var token = req.body.token;
    category = ['accomodation','food','event','cultural place','transport'];
    try{
        const decode = jwt.verify(token, 'testkey');
        email = decode.email;
    }catch(error){
        sendLog(error.toString());
        return res.send({statu: false, msg:"error"});
    }
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
    db.query("SELECT travels.name,avg(amount),sum(amount),category,start_date,end_date FROM travels INNER JOIN expenses ON travels.name=expenses.travel GROUP BY travels.name,category,start_date,end_date",[email]).then(result => {
        for(const ex of result){
            var days = 0;
            if (ex.end_date != null){
                a=ex.start_date;
                b=ex.end_date;
                var utc1 = Date.UTC(a.substring(0,4), a.substring(5,7), a.substring(8,10));
                var utc2 = Date.UTC(b.substring(0,4), b.substring(5,7), b.substring(8,10));

                days = Math.floor((utc2 - utc1) / _MS_PER_DAY);
            }else{
                a=ex.start_date;
                var date = new Date();
                var day = (date.getDate()<10)? ("0"+date.getDate()):(date.getDate());
                var month = (date.getMonth()<10)? ("0"+(date.getMonth()+1)):(date.getMonth()+1);
                var utc1 = Date.UTC(a.substring(0,4), a.substring(5,7), a.substring(8,10));
                var utc2 = Date.UTC(date.getFullYear(),month,day);

                days = Math.floor((utc2 - utc1) / _MS_PER_DAY);
            }
            ex.avg = ex.sum/days;
        }
        res.send(result);
    })
    .catch(error => {
        sendLog(error.toString());
        return res.send({status: false, msg: "error"});
    })
    
})

app.listen(3002, () => {
    sendLog('Listening on port: ' + 3002);
});