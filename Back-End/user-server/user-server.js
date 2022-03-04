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
                console.log(err);
                if(err.code == '23505'){
                    return res.send({status: false, msg:"keyerror"});
                }else{
                    return res.send({status: false, msg:"error"});
                }      
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
                console.log(err);
                return res.send({status: false, msg:"error"});
                
            })
});

app.post('/changepassword',jsonParser, function (req, res) {
    console.log("POST /changepassword");
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
        console.log(hash2);
        db.query('SELECT password FROM users WHERE email = $1', [email])
            .then(result => {
                if(result[0].password == hash2){
                    db.query('UPDATE users SET password=$1 WHERE email=$2', [hash,email,hash2])
                    .then(result1 => {
                        return res.send({status: true, msg: "ok"});
                    })
                    .catch(err1 => {
                        console.log(err1);
                        return res.send({status: false, msg:"error"});    
                    })
                }else{
                    return res.send({status: false, msg:"wrong password"});
                }
            })
            .catch(err => {
                console.log(err);
                return res.send({status: false, msg:"error"});    
            })

    }catch(error){
        console.log(error);
        return res.send({status: false, msg:"error"});
    }
});

app.listen(3003, () => {
    console.log('Listening on port: ' + 3003);
})