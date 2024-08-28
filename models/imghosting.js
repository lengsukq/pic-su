const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('imghosting', {
    bed_type_remarks: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "图床备注"
    },
    bed_type_code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "关联的用户id",
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    headers: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "JSON格式，请求头"
    },
    valuePath: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "数据取值路径"
    },
    bed_type_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "图床api地址"
    },
    img_file_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "图片文件param参数名"
    },
    other_params: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "其他的参数，JSON格式"
    }
  }, {
    sequelize,
    tableName: 'imghosting',
    schema: 'public',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    indexes: [
      {
        name: "imghosting_pkey",
        unique: true,
        fields: [
          { name: "bed_type_code" },
        ]
      },
    ]
  });
};
