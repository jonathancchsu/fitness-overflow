'use strict';
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    title: {
      allowNull: false,
      type: DataTypes.STRING(300)
    },
    body: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    categoryId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    votes: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  Question.associate = function(models) {
    // associations can be defined here
    Question.belongsTo(models.Category, { foreignKey: 'categoryId' })
    Question.belongsTo(models.User, { foreignKey: 'userId' })
    Question.hasMany(models.Answer, { foreignKey: 'questionId' })

  };
  return Question;
};
