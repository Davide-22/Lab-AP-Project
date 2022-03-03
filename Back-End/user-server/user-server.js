const expr = require('express');
const crypto = require('crypto');
var bodyParser = require('body-parser');
const pgp = require("pg-promise")();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = expr();
const cn = {
    host: 'localhost',
    port: 5432,
    database: 'LAPdb',
    user: 'postgres',
    password: 'secPWD78'
};
const db = pgp(cn);
var jsonParser = bodyParser.json();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


app.get('/', function (req, res) {
    console.log("GET /");
    res.send("CIAO");
})

app.post('/signup',jsonParser, function (req, res) {
    console.log("POST /signup");
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
                if(err.code == '23505'){
                    res.send({status: false, msg:"keyerror"});
                }else{
                    res.send({status: false, msg:"error"});
                }
                console.log(err);
            })
});

app.post('/login',jsonParser, function (req, res) {
    console.log("POST /login " + req.body.email);
    email = req.body.email;
    password = req.body.password;
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, hash])
            .then(result => {
                if(result.length > 0){
                    let data = {
                        email: email,
                        time: Date()
                    }
                    const token = jwt.sign(data, "testkey");
                    res.send({status: true, msg: token});
                }else{
                    res.send({status: false, msg:"wrong email or password"});
                }
            })
            .catch(err => {
                res.send({status: false, msg:"error"});
                console.log(err);
            })
});

app.listen(3003, () => {
    console.log('Listening on port: ' + 3003);
})