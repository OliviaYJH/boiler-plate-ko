if(process.env.NODE_ENV === 'production'){ // ENODE_ENV: ȯ�溯��
    module.exports = require('./prod');
}else{
    module.exports = require('./dev');
}