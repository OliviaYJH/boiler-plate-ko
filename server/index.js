const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// User �� ��������
const { User } = require("./models/User");
const { auth} = require('./middleware/auth');

// bodyParser�� Client���׼� ���� ������ �������� �м��� ������ �� �ְ�
// application/-www-form-urlencoded �ε� �����͸� �м��� ������ �� �ְ�
app.use(bodyParser.urlencoded({extended: true}));
// application/json
app.use(bodyParser.json()); 
app.use(cookieParser());

// ���ø����̼ǰ� ����DB ����
const mongoose = require('mongoose');
const e = require('express');

const config = require('./config/key');

mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB Connected...')) // ���� Ȯ��
.catch((e) => console.log('MongoDB error: ',e)); // error �߻��� �����ְ� ��


app.get('/', (req, res) => res.send('Hello World! hihi'))


app.get('/api/hello', (req, res) => {
    res.send("Hello World!~")
})

// Register Route
app.post('/api/users/register', (req,res) => {
    /* ȸ�� ���� �� �� �ʿ��� �������� client���� ��������
    �װ͵��� ������ ���̽��� �־��ش� */

    // bodyParser�� �̿��ؼ� req.body�� Client�� ������ ������ ����
    const user = new User(req.body)
    
    // ������ save �ϱ� ���� ����� ��ȣȭ �ؾ� ��
    // index.js�� userSchema.pre() �Լ� ����
    
    // save()�� MongDB �޼ҵ� => �������� user �𵨿� �����
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err}) // json �������� ���� �޼��� ����
        return res.status(200).json({ // status(200): �����ߴٴ� �ǹ� 
            // userInfo�� Client�� ���� ����
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {
    // ��û�� �̸����� ������ ���̽��� �ִ��� Ȯ��
    User.findOne({email: req.body.email}, (err, user)=> {
        if(!user) {// �̸����� ���� user�� ���ٸ�
            return res.json({
                loginSuccess: false,
                message: "������ �̸��Ͽ� �ش��ϴ� ������ �����ϴ�."
            })
        }

        // user�� �ִٸ� ��û�� �̸����� ������ ���̽��� �ִٸ� ����� �´� ������� Ȯ��
        user.comparePassword(req.body.password, (err, isMatch) => {
            // �޼ҵ�� User.js(user model) ���� ����
            if(!isMatch) // ����� Ʋ�� ���
                return res.json({loginSuccess: false, message: "��й�ȣ�� Ʋ�Ƚ��ϴ�."})
            
            // ��й�ȣ�� �´ٸ� Token �����ϱ�
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                // token�� ��Ű�� ����
                res.cookie("x_auth", user.token)
                .status(200) // ����
                .json({loginSuccess: true, userId: user._id})
            })
        })
    })
})

// role 0 -> �Ϲ� ����          role 0�� �ƴϸ� ������
app.get('/api/users/auth', auth, (req, res) => {
    // ������� �̵��� ����ߴٴ� �ǹ̴� Authentication�� True��� �ǹ�
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