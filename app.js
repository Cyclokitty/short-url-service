const express = require('express');
const app = express();
const validUrl = require('valid-url');
const shortid = require('shortid');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

  app.get('/db/:link(*)', (req, res) => {
    const link = req.params.link;

    MongoClient.connect(process.env.MONGODB_URI, (err, db) => {
      assert.equal(null, err);
      console.log('Connected to MongoDB server.');
    db.collection('urls').find({shorturl: link}).toArray().then((docs) => {
      if (docs.length > 0) {
        console.log(JSON.stringify(docs, undefined, 2));
        console.log(docs[0].longurl);
        res.redirect(docs[0].longurl);
      } else {
        console.log('this is not in our records');
        res.send('This is not in our records');
      }
    }, (err) => {
      console.log('Unable to fetch data, ', err);
    });
  });
});

app.get('/new/:newLink(*)', (req, res) => {
  MongoClient.connect(process.env.MONGODB_URI, (err, db) => {
    assert.equal(null, err);
    console.log('Connected to MongoDB server.');
  let newLink = req.params.newLink;
  if (validUrl.isUri(newLink)) {
    let shortId = shortid.generate();
    var shortLink = `https://puny-url.herokuapp.com/${shortId}`;
    console.log(shortLink);
    db.collection('urls').insertOne({longurl: newLink, shorturl: shortLink}, (err, result) => {
      if (err) {
        res.send('Sorry, we can\'t handle your request right now.');
        console.log('error when someone tries adding an url', err);
      }
      const info = {
        'longurl': result.ops[0].longurl,
        'shorturl': result.ops[0].shorturl,
      };
      res.send(info);
      console.log(info);
    });
  } else {
    console.log('not a real link');
    res.send('That is not a proper URL. Try again.');
  }
  console.log(shortLink);
});
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
