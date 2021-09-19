const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');

// User �� ��������
const { User } = require("./models/User");

// bodyParser�� Client���׼� ���� ������ �������� �м��� ������ �� �ְ�
// application/-www-form-urlencoded �ε� �����͸� �м��� ������ �� �ְ�
app.use(bodyParser.urlencoded({extended: true}));
// application/json
app.use(bodyParser.json()); 

// ���ø����̼ǰ� ����DB ����
const mongoose = require('mongoose');
const e = require('express');

const config = require('./config/key');

mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB Connected...')) // ���� Ȯ��
.catch((e) => console.log('MongoDB error: ',e)); // error �߻��� �����ְ� ��


app.get('/', (req, res) => res.send('Hello World! hihi'))

app.post('/register', (req,res) => {
    /* ȸ�� ���� �� �� �ʿ��� �������� client���� ��������
    �װ͵��� ������ ���̽��� �־��ش� */

    // bodyParser�� �̿��ؼ� req.body�� Client�� ������ ������ ����
    const user = new User(req.body)

    // save()�� MongDB �޼ҵ� => �������� user �𵨿� �����
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err}) // json �������� ���� �޼��� ����
        return res.status(200).json({ // status(200): �����ߴٴ� �ǹ� 
            // userInfo�� Client�� ���� ����
            success: true
        })
    })

})

app.listen(port, () => {
  console.log(`Example app listening at on port ${port}`)
})