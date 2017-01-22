const express = require('express');
let app = express();
const validUrl = require('valid-url');
const shortid = require('shortid');

//sampling shortid
console.log(shortid.generate());

// sampling validUrl
const isValid = 'https://cyclokitty.github.io';
if (validUrl.isUri(isValid)) {
  console.log(`${isValid} is fine.`);
} else {
  console.log('Nope');
}

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/:link(*)', (req, res) => {
  const link = req.params.link;
  if (validUrl.isUri(link)) {
    let shortId = shortid.generate();
    let shortLink = `http://localhost:3000/${shortId}`;
    res.json({ "valid": `${link}`, "shortId": `${shortLink}` });
  } else {
    res.send(`Your link is not valid. Please try again.`);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
