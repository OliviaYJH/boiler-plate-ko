const express = require('express')
const app = express()
const port = 3000

// 어플리케이션과 몽고DB 연결
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://olivia:2503wjdgus@cluster0.psc8h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...')) // 연결 확인
  .catch(err => console.log(arr)) // error 발생시 보여주게 함


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at on port ${port}`)
})