const express = require('express');
const db = require('../../db/models');
const { asyncHandler } = require('../../utils.js');

const router = express.Router();

router.get('/answeres/id(\\d+)', asyncHandler(async (req, res) => {
  const answerId = req.params.id;
  const answer = await db.Answer.findOne ({
    where: {id: answerId }
  });

  const votes = answer.votes;

  const data = {
    id: answer.id,
    userId: answer.userId,
    questionId: answer.questionId,
    body: answer.body,
    votes,
  }

  res.json({ answer: data});
}))

router.get('/questions/:questionId(\\d+)/answers', asyncHandler(async (req, res) => {
  const questionId = parseInt(req.params.questionId);

  const question = await db.Question.findOne({
      where: { id: questionId },
      include: {
          model: db.Answer,
      },
  });
  const answers = question.Answers.map(answer => {
      const votes = answer.votes;

      const data = {
          id: answer.id,
          userId: answer.userId,
          questionId: answer.questionId,
          body: answer.body,
          votes,
      };

      return data;
  });

  res.json({ answers });
}));

router.post('/questions/:questionId(\\d+)/answers', asyncHandler(async (req, res) => {
  const questionId = parseInt(req.params.questionId);
  const userId = req.session.auth.userId;
  const { body } = req.body;

  const answer = await db.Answer.create({ questionId, userId, body: body });

  const data = {
      id: answer.id,
      userId: answer.userId,
      questionId: answer.questionId,
      body: answer.body,
      votes,
  };

  res.json({ answer: data });
}));

router.put('/answers/:id(\\d+)', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const answer = await db.Answer.findByPk(id);
  const { body } = req.body;

  if (answer) {
      answer.body = body;
      await answer.save();
      res.json(body);
  }
}));

router.delete('/answers/:id(\\d+)', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const answer = await db.Answer.findByPk(id);

  if (answer) {
      answer.destroy();
      res.status(204).end();
  }
}));

module.exports = router;
