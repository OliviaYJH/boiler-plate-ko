const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');

// User 모델 가져오기
const { User } = require("./models/User");

// bodyParser가 Client한테서 오는 정보를 서버에서 분석해 가져올 수 있게
// application/-www-form-urlencoded 로된 데이터를 분석해 가져올 수 있게
app.use(bodyParser.urlencoded({extended: true}));
// application/json
app.use(bodyParser.json()); 

// 어플리케이션과 몽고DB 연결
const mongoose = require('mongoose');
const e = require('express');

const config = require('./config/key');

mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB Connected...')) // 연결 확인
.catch((e) => console.log('MongoDB error: ',e)); // error 발생시 보여주게 함


app.get('/', (req, res) => res.send('Hello World! hihi'))

app.post('/register', (req,res) => {
    /* 회원 가입 할 때 필요한 정보들을 client에서 가져오면
    그것들을 데이터 베이스에 넣어준다 */

    // bodyParser을 이용해서 req.body로 Client가 보내는 정보를 받음
    const user = new User(req.body)

    // save()는 MongDB 메소드 => 정보들이 user 모델에 저장됨
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err}) // json 형식으로 에러 메세지 전달
        return res.status(200).json({ // status(200): 성공했다는 의미 
            // userInfo를 Client에 정보 전달
            success: true
        })
    })

})

app.listen(port, () => {
  console.log(`Example app listening at on port ${port}`)
})