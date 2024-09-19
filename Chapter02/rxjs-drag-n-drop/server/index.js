const express = require('express')
const cors = require('cors')

const app = express()
 
app.use(cors({
  origin: 'http://localhost:4200',
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Access-Control-Allow-Origin',
  ]
}))
 
app.post('/api/recipes/upload', (req, res) => {
  res.sendStatus(200)
})
 
const server = app.listen(3333, () => {
  console.log(`Listening at http://localhost:3333/api`)
})