# Pic-Su
图片上传网站，也可以理解为图床管理系统，基于react+nextjs+typescript+ant design+tailwindcss开发，使用postgresql数据库，拥有图片上传、相册管理、token分发等功能。

### vercel一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lengsukq/pic-su&project-name=Pic-Su&repository-name=Pic-Su)

### 环境变量
```text
// 数据库用户名
DB_USER=****
// 数据库密码
DB_PASSWORD=******
// 数据库地址
DB_HOST=*.*.*.*
// 数据库端口
DB_PORT=5432
// 数据库名称
DB_NAME=pic-su
// 数据库连接地址 与上面五个变量二选一即可
DATABASE_URL=postgres://username:password@hostname:port/database
// token加密密钥（自己随便填）
JWT_SECRET_KEY=*******
```