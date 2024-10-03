const express = require('express');
const app = express();
const cors = require('cors')
const port = 3000;

app.use(cors({
    origin: 'http://127.0.0.1:8080',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Access-Control-Allow-Origin',
    ]
}))

app.post('/api/recipes', (req, res) => {
  res.status(200).json({ message: 'Recipe created' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
