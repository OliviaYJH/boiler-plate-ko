// mongoose 모델 가져오기
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');


// Schema 생성
const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true, // spacebar 제거 역할
        unique: 1
    },
    password:{
        type: String,
        minlenght: 5
    },
    lastname:{
        type: String,
        maxlenght: 50
    },
    role:{
        type: Number,
        default: 0 // 기본값
    },
    image: String,
    token: { // 유효성 관리 위해
        type: String
    },
    tokenExp:{ // 토큰 사용할 수 있는 기간
        type: Number
    }
})


// pre()는 mongoose에서 가져온 메소드
userSchema.pre('save', function(next){
    // User의 정보를 저장하기 전에 함수 실행

    var user = this; // userSchema를 나타냄

    // 비밀번호를 변경할 경우에만 암호화하기 위해서
    if(user.isModified('password')){
        // 비밀번호를 암호화시킴
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash // hash로 비번을 바꿈
                next() // 돌아가기
            });
        });
    } else{
        next()
    }
}) 


userSchema.methods.comparePassword = function(plainPassword, cb){
    // plainPassword와 암호화된 pw가 같은지 확인
    bcrypt.compare(plainPassword, this.password, function(err,isMatch){
        if(err) return cb(err);
            cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this; // 유저의 id 넣어줌

    // jsonwebtoekn을 이용해 token 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token,cb){
    var user = this;

    // 토큰을 decode 하기
    jwt.verify(token, 'secretToken', function(err, decoded){
        // 유저 아이디를 이용해서 유저를 찾은 후 클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        })
    })
}

const User = mongoose.model('User', userSchema) // 모델 이름, Schema 이름

// 외부에서 사용 가능하도록 
module.exports = {User}