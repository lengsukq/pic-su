// 'use strict';
// // sequelize.model.js
// const { exec } = require('child_process');
// const modelName  = 'pic-su';
// const database = {
//     // [required] * 数据库地址
//     host: process.env.DB_HOST,
//     // [required] * 数据库名称
//     database:  process.env.DB_NAME,
//     // 数据库用户名
//     user: process.env.DB_USER,
//     // 数据库密码
//     pass: process.env.DB_PASSWORD,
//     // 数据库端口号
//     port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
//     // Sequelize的构造函数“options”标记对象的JSON文件路径
//     config: '',
//     // 输出文件路径
//     output: './Model',
//     // 数据库类型：postgres, mysql, sqlite
//     dialect: 'postgres',
//     // 包含在model的配置参数中define的模型定义的JSON文件路径
//     additional: '',
//     // 表名,多个表名逗号分隔
//     tables: modelName || '',
//     // 要跳过的表名，多个表名逗号分隔
//     'skip-tables': '',
//     // 使用驼峰命名模型和字段
//     camel: true,
//     // 是否写入文件
//     'no-write': false,
//     // 从中检索表的数据库架构
//     schema: false,
//     // 将模型输出为typescript文件
//     typescript: false,
// };
//
// let connectShell = 'sequelize-auto';
// for (const i in database) {
//     const value = database[i];
//     if (value) {
//         if (value === true) {
//             connectShell += ` --${i}`;
//         } else {
//             connectShell += ` --${i} ${value}`;
//         }
//     }
// }
// exec(connectShell, (err, stdout, stderr) => {
//     console.log(`stderr: ${stderr}`);
//     console.log(`stdout: ${stdout}`);
//     if (err) {
//         console.log(`exec error: ${err}`);
//     }
// });