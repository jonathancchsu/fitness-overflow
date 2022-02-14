'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING(50)
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
