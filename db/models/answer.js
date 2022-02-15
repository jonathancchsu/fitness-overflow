'use strict';
module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
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
      type: DataTypes.INTEGER
    },
    questionId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    votes: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  Answer.associate = function(models) {
    Answer.belongsTo(models.User, {foreignKey: 'userId'})
    Answer.belongsTo(models.Question, { foreignKey: 'questionId'})
    // associations can be defined here
  };
  return Answer;
};
