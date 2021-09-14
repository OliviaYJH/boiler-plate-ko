// mongoose �� ��������
const mongoose = require('mongoose');

// Schema ����
const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true, // spacebar ���� ����
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
        default: 0 // �⺻��
    },
    image: String,
    token: { // ��ȿ�� ���� ����
        type: String
    },
    tokenExp:{ // ��ū ����� �� �ִ� �Ⱓ
        type: Number
    }
})

const User = mongoose.model('User', userSchema) // �� �̸�, Schema �̸�

// �ܺο��� ��� �����ϵ��� 
module.exports = {User}