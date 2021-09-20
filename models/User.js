// mongoose �� ��������
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');


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


// pre()�� mongoose���� ������ �޼ҵ�
userSchema.pre('save', function(next){
    // User�� ������ �����ϱ� ���� �Լ� ����

    var user = this; // userSchema�� ��Ÿ��

    // ��й�ȣ�� ������ ��쿡�� ��ȣȭ�ϱ� ���ؼ�
    if(user.isModified('password')){
        // ��й�ȣ�� ��ȣȭ��Ŵ
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash // hash�� ����� �ٲ�
                next() // ���ư���
            });
        });
    } else{
        next()
    }
}) 


userSchema.methods.comparePassword = function(plainPassword, cb){
    // plainPassword�� ��ȣȭ�� pw�� ������ Ȯ��
    bcrypt.compare(plainPassword, this.password, function(err,isMatch){
        if(err) return cb(err);
            cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this; // ������ id �־���

    // jsonwebtoekn�� �̿��� token ����
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token,cb){
    var user = this;

    // ��ū�� decode �ϱ�
    jwt.verify(token, 'secretToken', function(err, decoded){
        // ���� ���̵� �̿��ؼ� ������ ã�� �� Ŭ���̾�Ʈ���� ������ ��ū�� DB�� ������ ��ū�� ��ġ�ϴ��� Ȯ��
        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        })
    })
}

const User = mongoose.model('User', userSchema) // �� �̸�, Schema �̸�

// �ܺο��� ��� �����ϵ��� 
module.exports = {User}