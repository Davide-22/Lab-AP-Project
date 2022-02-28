const expr = require('express');

const app = expr();


app.get('/', function (req, res) {
    res.send("ciao");
});

app.listen(3002, () => {
    console.log('Listening on port: ' + 3002);
})