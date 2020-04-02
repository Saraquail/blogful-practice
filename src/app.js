require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const ArticlesService = (require('./articles-service'))
const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.get('/articles', (req, res, next) => {
  const knexInstance = req.app.get('db')
  ArticlesService.getAllArticles(knexInstance)
    .then(articles=> {
      res.json(articles)
    })
    .catch(next)
})

app.use((error, req, res, next) => {
  let message
  if (NODE_ENV === 'production') {
    message = 'Server error'
  }
  else {
    console.error(error)
    message = error.message
  }
  res.status(500).json(message)
})



app.get('/', (req, res) => {
  res.send('Hello, boilerplate!')
})

module.exports = app