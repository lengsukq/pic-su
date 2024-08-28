var DataTypes = require("sequelize").DataTypes;
var _albums = require("./albums");
var _images = require("./images");
var _imghosting = require("./imghosting");
var _tokens = require("./tokens");
var _users = require("./users");

function initModels(sequelize) {
  var albums = _albums(sequelize, DataTypes);
  var images = _images(sequelize, DataTypes);
  var imghosting = _imghosting(sequelize, DataTypes);
  var tokens = _tokens(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  images.belongsTo(albums, { as: "album", foreignKey: "album_id"});
  albums.hasMany(images, { as: "images", foreignKey: "album_id"});
  albums.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(albums, { as: "albums", foreignKey: "user_id"});
  images.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(images, { as: "images", foreignKey: "user_id"});
  tokens.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(tokens, { as: "tokens", foreignKey: "user_id"});

  return {
    albums,
    images,
    imghosting,
    tokens,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
