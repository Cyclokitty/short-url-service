const express = require('express');
let app = express();
const validUrl = require('valid-url');
const shortid = require('shortid');

//sampling shortid
console.log(shortid.generate());

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
