const expr = require('express');
const crypto = require('crypto');
var bodyParser = require('body-parser');
const pgp = require("pg-promise")();
const jwt = require('jsonwebtoken');
const amqp = require('amqplib/callback_api');

const app = expr();
const cn = {
    host: 'postgres',
    port: 5432,
    database: 'LAPdb',
    user: 'postgres',
    password: 'postgres'
};
const db = pgp(cn);
var jsonParser = bodyParser.json();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  function sendLog(message) {
    console.log(message)
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
            channel.publish(exchange, '', Buffer.from('[user-server] [' + h + ":" + m + ":" + s + '] ' + message));
        });
        setTimeout(function () {
            connection.close();
        }, 500);
    })
}



app.post('/signup',jsonParser, function (req, res) {
    sendLog("POST /signup");
    password = req.body.password;
    username = req.body.user;
    email = req.body.email;
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    db.query('INSERT INTO users VALUES ($1, $2, $3)', [email, hash, username])
            .then(result => {
                res.send({status: true, msg:"ok"});
            })
            .catch(err => {
                sendLog(err);
                if(err.code == '23505'){
                    return res.send({status: false, msg:"keyerror"});
                }else{
                    return res.send({status: false, msg:"error"});
                }      
            })
});

app.post('/login',jsonParser, function (req, res) {
    sendLog("POST /login " + req.body.email);
    email = req.body.email;
    password = req.body.password;
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, hash])
            .then(result => {
                if(result.length > 0){
                    const d = new Date();
                    let data = {
                        email: email,
                        time: d.toUTCString()
                    }
                    const token = jwt.sign(data, "testkey");
                    res.send({status: true, msg: token});
                }else{
                    return res.send({status: false, msg:"wrong email or password"});
                }
            })
            .catch(err => {
                sendLog(err);
                return res.send({status: false, msg:"error"});
                
            })
});

app.post('/verify',jsonParser, function(req,res) {
    sendLog("POST /verify");
    token = req.body.token;
    try{
        const decode = jwt.verify(token, 'testkey');
        email = decode.email;
        db.query('SELECT * FROM users WHERE email = $1', [email])
            .then(result => {
                if(result.length > 0) return res.send({status: true, msg: "ok"});
                else res.send({status: false, msg: "email not in database"})
            })
            .catch(err => {
                sendLog(err);
                return res.send({status: false, msg: "error"})
            })
    }catch(error) {
        return res.send({status: false, msg:"error"});
    }
})

app.post('/changepassword',jsonParser, function (req, res) {
    sendLog("POST /changepassword");
    oldpassword = req.body.oldpassword;
    password = req.body.password;
    token = req.body.token;
    try{
        const decode = jwt.verify(token, 'testkey');
        email = decode.email;
        const sha256 = crypto.createHash('sha256');
        const hash = sha256.update(password).digest('base64');
        const sha256_2 = crypto.createHash('sha256');
        const hash2 = sha256_2.update(oldpassword).digest('base64');
        db.query('SELECT password FROM users WHERE email = $1', [email])
            .then(result => {
                if(result[0].password == hash2){
                    db.query('UPDATE users SET password=$1 WHERE email=$2', [hash,email,hash2])
                    .then(result1 => {
                        return res.send({status: true, msg: "ok"});
                    })
                    .catch(err1 => {
                        sendLog(err1);
                        return res.send({status: false, msg:"error"});    
                    })
                }else{
                    return res.send({status: false, msg:"wrong password"});
                }
            })
            .catch(err => {
                sendLog(err);
                return res.send({status: false, msg:"error"});    
            })

    }catch(error){
        sendLog(error);
        return res.send({status: false, msg:"error"});
    }
});

app.post('/account',jsonParser,function(req,res) {
    sendLog("POST /account");
    token = req.body.token;
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
    try{
        const decode = jwt.verify(token, 'testkey');
        email = decode.email;
        travels_done = 0;
        days = 0;
        db.query('SELECT * FROM travels WHERE travels.user_email=$1',[email])
            .then(result => {
                for (i in result) {
                    if (result[i].end_date != null){
                        travels_done++;
                        a=result[i].start_date;
                        b=result[i].end_date;
                        var utc1 = Date.UTC(a.substring(0,4), a.substring(5,7), a.substring(8,10));
                        var utc2 = Date.UTC(b.substring(0,4), b.substring(5,7), b.substring(8,10));

                        days += Math.floor((utc2 - utc1) / _MS_PER_DAY);
                    }
                }
                db.query('SELECT username FROM users WHERE email=$1',[email])
                    .then(result => {
                        res.send({travels_done: travels_done, days: days, email: email, username: result[0].username});
                    })
                    .catch(err => {
                        sendLog(err);
                        return res.send({status: false, msg: "error"})
                    })
            })
            .catch(err => {
                sendLog(err);
                return res.send({status: false, msg: "error"})
            })
    }catch(error) {
        sendLog(error);
        return res.send({status: false, msg:"error"});
    }
});

app.post('/deleteaccount',jsonParser, function (req, res) {
    sendLog("POST /deleteaccount");
    token = req.body.token;
    try{
        const decode = jwt.verify(token, 'testkey');
        email = decode.email;
        db.query('DELETE FROM users WHERE email=$1', [email])
                .then(result => {
                    res.send({status: true, msg:"ok"});
                })
                .catch(err => {
                    sendLog(err);
                    return res.send({status: false, msg:"error"});  
                })
    }catch(error) {
        sendLog(error);
        return res.send({status: false, msg:"error"});
    }
});

app.listen(3003, () => {
    sendLog('Listening on port: ' + 3003);
})