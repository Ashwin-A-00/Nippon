const express = require('express')
const cors = require('cors')
require('dotenv').config()

const routes = require('./routes/index')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', routes)

app.get('/', (req, res) => res.json({ message: 'Nippon Incentive API running' }))

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))