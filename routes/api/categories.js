const express = require('express');
const db = require('../../db/models');
const { asyncHandler } = require('../../utils.js');

const router = express.Router();

router.get('/questions/:questionId(\\d+)/categories', asyncHandler(async (req, res) => {
  const questionId = req.params.questionId;
  const question = await db.Question.findOne({
    where: {
      id: questionId,
    },
    include: {
      model: db.Category,
    },
  })

  const categories = question.Categories.map(category => {
    const name = question.Categories;

    const data = {
      id: category.id,
      name: name,
    }

    return data;
  })

  res.json({ data })
}));

router.put('/answers/:answerId(\\d+)/categories', asyncHandler(async (req, res) => {
  const answerId = req.params.answerId;
  const answer = await db.Answer.findOne({
    where: {
      id: answerId,
    }
  })

  const category = await db.Category.findOne({
    where: {
      id: answer.categoryId,
    },
  })

  const { name } = req.body;

  if (category) {
    category.name = name;
    await category.save();
    res.json(name);
  }
}));
