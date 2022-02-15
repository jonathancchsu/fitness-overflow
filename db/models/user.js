'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      allowNull: false,
      type: DataTypes.STRING(50),
      unique: true
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    hashedPassword: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Question, {foreignKey: 'userId'})
    User.hasMany(models.Answer, {foreignKey: 'userId'})
    // associations can be defined here
  };
  return User;
};
