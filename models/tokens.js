const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tokens', {
    token_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "token的唯一标识符，自动增加的序列",
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "与用户表的ID字段关联的外键",
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "实际的token字符串，必须唯一",
      unique: "tokens_token_key"
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "token设定的过期时间戳，包含时区信息"
    },
    album_permissions: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      comment: "token对应的相册权限"
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "对于token的描述"
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL",
      comment: "标识token的当前状态"
    },
    usage_limit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "定义token允许的最大使用次数"
    },
    current_usage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "记录token已经被使用的次数"
    },
    token_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "token名称"
    }
  }, {
    sequelize,
    tableName: 'tokens',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "token_id",
        unique: true,
        fields: [
          { name: "token_id" },
        ]
      },
      {
        name: "tokens_token_key",
        unique: true,
        fields: [
          { name: "token" },
        ]
      },
    ]
  });
};
