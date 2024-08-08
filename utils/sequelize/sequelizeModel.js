'use strict';
// sequelize.model.js
const child_process = require('child_process');
const { exec } = child_process;
const dotenv = require('dotenv')
const env = dotenv.config({ path: './.env.local' }).parsed // 环境参数
const database = {
    // [required] * 数据库地址
    host: env.DB_HOST,
    // [required] * 数据库名称
    database: env.DB_NAME,
    // 数据库用户名
    user: env.DB_USER,
    // 数据库密码
    pass: env.DB_PASSWORD,
    // 数据库端口号
    port: env.DB_PORT ? parseInt(env.DB_PORT, 10) : 5432,
    // Sequelize的构造函数“options”标记对象的JSON文件路径
    config: '',
    // 输出文件路径
    output: './models',
    // 数据库类型：postgres, mysql, sqlite
    dialect: 'postgres',
    // 包含在model的配置参数中define的模型定义的JSON文件路径
    additional: 'utils/sequelize/additional.json',
    // 表名,多个表名逗号分隔
    tables: '',
    // 要跳过的表名，多个表名逗号分隔
    'skip-tables': '',
    // 使用驼峰命名模型和字段
    camel: false,
    // 是否写入文件
    'no-write': false,
    // 从中检索表的数据库架构
    schema: false,
    // 将模型输出为typescript文件
    typescript: false,
    timestamps: 'true',
};
console.log('database',database)
let connectShell = 'sequelize-auto';
for (const i in database) {
    const value = database[i];
    if (value) {
        if (value === true) {
            connectShell += ` --${i}`;
        } else {
            connectShell += ` --${i} ${value}`;
        }
    }
}
exec(connectShell, (err, stdout, stderr) => {
    console.log(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout}`);
    if (err) {
        console.log(`exec error: ${err}`);
    }
});