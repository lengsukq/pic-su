const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('imghosting', {
    bed_type_remarks: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    bed_type_code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
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
