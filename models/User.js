// mongoose 모델 가져오기
const mongoose = require('mongoose');

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

const User = mongoose.model('User', userSchema) // 모델 이름, Schema 이름

// 외부에서 사용 가능하도록 
module.exports = {User}