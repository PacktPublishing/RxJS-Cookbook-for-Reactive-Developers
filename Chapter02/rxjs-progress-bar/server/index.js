const express = require('express')
const fileUpload = require('express-fileupload')
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
app.use(fileUpload())
 
app.post('/api/recipes', (req, res) => {
  res.sendStatus(200)
})
 
const server = app.listen(3333, () => {
  console.log(`Listening at http://localhost:3333/api`)
})