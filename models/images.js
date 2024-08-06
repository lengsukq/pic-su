const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('images', {
    image_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "图片id",
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "用户id",
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "文件名"
    },
    filepath: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    album_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "对应的相册id"
    },
    token_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    update_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'images',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "images_pkey",
        unique: true,
        fields: [
          { name: "image_id" },
        ]
      },
    ]
  });
};
