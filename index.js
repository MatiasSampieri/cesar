const express = require('express');
const path = require('path');

const app = express();
const PORT = 81;

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('App iniciada en puerto: ' + PORT);
    }
});