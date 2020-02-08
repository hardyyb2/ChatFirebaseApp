const express = require(`express`)
const socket = require(`socket.io`)

//setting up server
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const port = process.env.PORT || 3000

//setting public directory
app.use(express.static(`public`))

app.post('/pin', (req, res) => {
  let answer = req.body.pin
  let allow = false
  console.log(answer)
  if (answer === `Hardikisthebest69`) allow = true

  res.status(200).send(allow)
})

const server = app.listen(port, () => {
  console.log(`listening to port...`)
})

const io = socket(server)
//setting socket connection
io.on(`connection`, socket => {
  console.log(`made a connection`)
  socket.on(`chat`, data => {
    socket.emit(`assignright`, data, { position: true })
    socket.broadcast.emit(`chat`, data)
  })

  socket.on(`typing`, data => {
    socket.broadcast.emit(`typing`, data)
  })
})
