const express = require('express')
const { v4: uuidv4 } = require('uuid');
const app = express()
const port = process.env.PORT || 3000
const BodyParser = require("body-parser");
var cors = require('cors')

app.use(BodyParser.urlencoded({ extended: true }))
app.use(express.json());

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: '*'
}));


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})