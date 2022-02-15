require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const BodyParser = require('body-parser');
var mongoose = require('mongoose');
const { shortenURL, findURL} = require('./utils/api');

const port = process.env.PORT || 3001;

app.use(BodyParser.urlencoded({extended: false}));
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));

mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(err => {
  console.log('Mongoose connection failed:\n' + err)
});

const connection = mongoose.connection;

connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', async (req, res) => {
  await shortenURL(req, res)
})

app.get('/api/shorturl/:short_url?', async function (req, res) {
  await findURL(req, res);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
