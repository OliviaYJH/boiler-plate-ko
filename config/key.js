if(process.env.NODE_ENV === 'production'){ // ENODE_ENV: 환경변수
    module.exports = require('./prod');
}else{
    module.exports = require('./dev');
}