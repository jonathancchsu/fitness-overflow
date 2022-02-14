'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      allowNull: false,
      type: DataTypes.STRING(50),
      unique: true
    }
  }, {});
  Category.associate = function(models) {
    Category.hasMany(models.Question, {foreignKey: 'categoryId'})
    // associations can be defined here
  };
  return Category;
};
