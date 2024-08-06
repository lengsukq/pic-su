const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    user_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "用户的唯一标识符",
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "用户名",
      unique: "users_username_key"
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "users_email_key"
    },
    SM_TOKEN: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "sm图床的token"
    },
    BILIBILI_SESSDATA: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "b站的SESSDATA"
    },
    BILIBILI_CSRF: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "b站的CSRF"
    },
    IMGBB_API: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "IMGBB图床的api"
    },
    TG_URL: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "tg的代理地址"
    }
  }, {
    sequelize,
    tableName: 'users',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "users_email_key",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "users_pkey",
        unique: true,
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "users_username_key",
        unique: true,
        fields: [
          { name: "username" },
        ]
      },
    ]
  });
};
