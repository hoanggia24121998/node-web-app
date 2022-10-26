const tracer = require('dd-trace').init()
const express = require('express')
import { uid } from 'uid';
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
const swaggerUi = require('swagger-ui-express');

app.use('/api-docs', swaggerUi.serve);
const { Client, Pool } = require('pg')
const connectionString = 'postgres://gianh:Eren1998@dbmovie.postgres.database.azure.com/moviedb?sslmode=require'
const pool = new Pool({
  connectionString
}
)


const client = new Client({
  connectionString
}
)

client.connect()
let blogObject = null



app.post('/blogs', async (req, res) => {
  const { body } = req
  const { name, description, country, views } = body
  const query = {
    text: "INSERT INTO Blog VALUES ($1, $2, $3, $4, $5, $6)",
    values: [uid(16), name, description, country, views, images_url],
  }
  await client
    .query(query)
    .then(res => {
      console.log(res.rows[0])
    })
    .catch(e => console.error(e.stack))
  res.status(201).send("Added")
})


app.get('/blogs', async (req, res) => {
  await client
    .query("SELECT * FROM Blog")
    .then(res => {
      blogObject = res.rows
      console.log(res.rows)
    })
    .catch(e => console.error(e.stack))
  res.send(blogObject)
})

app.get('/blogs/:id', async (req, res) => {
  const query = {
    text: "SELECT * FROM Blog WHERE blogid=$1",
    values: [req.params.id],
  }
  await client
    .query(query)
    .then(res => {
      blogObject = res.rows[0]
      console.log(res.rows[0])
    })
    .catch(e => console.error(e.stack))
  res.send(blogObject)
})

app.delete('/blogs/:id', async (req, res) => {
  blogObject = null
  let query = {
    text: "SELECT * FROM Blog WHERE blogid=$1",
    values: [req.params.id],
  }
  await client
    .query(query)
    .then(result => {
      blogObject = result.rows[0]
    })
    .catch(e => console.error(e.stack))
  if (!blogObject) {
    return res.status(500).send('Not found');
  }
  query = {
    text: "DELETE FROM Blog WHERE blogid=$1",
    values: [req.params.id],
  }

  await client
    .query(query)
    .then(res => {
      console.log(res.rows[0])
    })
    .catch(e => console.error(e.stack))
  res.send(`remove id: ${req.params.id}`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})