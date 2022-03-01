const expr = require('express');
const crypto = require('crypto');
const pgp = require("pg-promise")();

const app = expr();
const cn = {
    host: 'localhost',
    port: 5432,
    database: '',
    user: 'postgres',
    password: ''
};
const db = pgp(cn);


app.post('/signup', function (req, res) {
    password = req.body.password;
    username = req.body.user;
    email = req.body.email;
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    db.query('INSERT INTO users VALUES ($1, $2, $3)', [email, hash, username])
            .then(result => {
                res.send("OK");
            })
            .catch(err => {
                res.send("Error");
                console.log(err.message);
            })
});

app.listen(3002, () => {
    console.log('Listening on port: ' + 3002);
})