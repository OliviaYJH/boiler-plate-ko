const express = require('express')
const app = express()
const port = 3000

// ���ø����̼ǰ� ����DB ����
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://olivia:2503wjdgus@cluster0.psc8h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...')) // ���� Ȯ��
  .catch(err => console.log(arr)) // error �߻��� �����ְ� ��


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at on port ${port}`)
})