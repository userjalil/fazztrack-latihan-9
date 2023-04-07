const express = require('express')
const bodyParser = require('body-parser');
const router = require('./routes/index')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', router);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = app;