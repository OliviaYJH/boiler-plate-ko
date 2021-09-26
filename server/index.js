const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// User 모델 가져오기
const { User } = require("./models/User");
const { auth} = require('./middleware/auth');

// bodyParser가 Client한테서 오는 정보를 서버에서 분석해 가져올 수 있게
// application/-www-form-urlencoded 로된 데이터를 분석해 가져올 수 있게
app.use(bodyParser.urlencoded({extended: true}));
// application/json
app.use(bodyParser.json()); 
app.use(cookieParser());

// 어플리케이션과 몽고DB 연결
const mongoose = require('mongoose');
const e = require('express');

const config = require('./config/key');

mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB Connected...')) // 연결 확인
.catch((e) => console.log('MongoDB error: ',e)); // error 발생시 보여주게 함


app.get('/', (req, res) => res.send('Hello World! hihi'))


app.get('/api/hello', (req, res) => {
    res.send("Hello World!~")
})

// Register Route
app.post('/api/users/register', (req,res) => {
    /* 회원 가입 할 때 필요한 정보들을 client에서 가져오면
    그것들을 데이터 베이스에 넣어준다 */

    // bodyParser을 이용해서 req.body로 Client가 보내는 정보를 받음
    const user = new User(req.body)
    
    // 정보를 save 하기 전에 비번을 암호화 해야 함
    // index.js의 userSchema.pre() 함수 실행
    
    // save()는 MongDB 메소드 => 정보들이 user 모델에 저장됨
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err}) // json 형식으로 에러 메세지 전달
        return res.status(200).json({ // status(200): 성공했다는 의미 
            // userInfo를 Client에 정보 전달
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {
    // 요청된 이메일을 데이터 베이스에 있는지 확인
    User.findOne({email: req.body.email}, (err, user)=> {
        if(!user) {// 이메일을 가진 user가 없다면
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        // user가 있다면 요청된 이메일이 데이터 베이스에 있다면 비번이 맞는 비번인지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            // 메소드는 User.js(user model) 에서 생성
            if(!isMatch) // 비번이 틀린 경우
                return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})
            
            // 비밀번호가 맞다면 Token 생성하기
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                // token을 쿠키에 저장
                res.cookie("x_auth", user.token)
                .status(200) // 성공
                .json({loginSuccess: true, userId: user._id})
            })
        })
    })
})

// role 0 -> 일반 유저          role 0이 아니면 관리자
app.get('/api/users/auth', auth, (req, res) => {
    // 여기까지 미들웨어를 통과했다는 의미는 Authentication이 True라는 의미
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false: true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id},
        {token: ""},
        (err, user) => {
            if(err) return res.json({success: false, err});
            return res.status(200).send({
                success: true
            })
        })
})

app.listen(port, () => {
  console.log(`Example app listening at on port ${port}`)
})