const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('albums', {
    album_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "相册id",
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "用户id",
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    album_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "相册名称"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "相册描述"
    },
    album_cover: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "相册封面"
    }
  }, {
    sequelize,
    tableName: 'albums',
    schema: 'public',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    indexes: [
      {
        name: "albums_pkey",
        unique: true,
        fields: [
          { name: "album_id" },
        ]
      },
    ]
  });
};
