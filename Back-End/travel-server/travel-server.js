const expr = require('express');
const pgp = require("pg-promise")();

const cn = {
    host: 'localhost',
    port: 5432,
    database: '',
    user: 'postgres',
    password: ''
};
const db = pgp(cn);
const app = expr();

app.get('/', function (req, res) {
    db.query('').then(result=>res.send(result));
});

app.listen(3002, () => {
    console.log('Listening on port: ' + 3002);
})