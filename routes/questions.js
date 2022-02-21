const express = require('express');
const { check, validationResult } = require("express-validator");
const { asyncHandler, csrfProtection, handleValidationErrors, getDate, redirectToUser } = require('./utils');
const { requireAuth } = require("../auth");
const router = express.Router();
const db = require('../db/models');
const { CommandCompleteMessage } = require('pg-protocol/dist/messages');

const { Question, User, Answer } = db;

router.use(requireAuth);

const questionNotFoundError = (id) => {
  const err = Error("Question not found");
  err.errors = [`Question with id of ${id} could not be found.`];
  err.title = "Question not found";
  err.status = 404;
  return err;
};

const validateQuestion = [
  check("body")
    .exists({ checkFalsy: true })
    .withMessage("Question cannot be empty"),
  check("title")
    .exists({ checkFalsy: true })
    .withMessage("Title cannot be empty"),
  check("title")
    .isLength({ max: 300 })
    .withMessage("Question title cannot be over 300 characters."),
  check("categoryId")
    .exists({ checkFalsy: true })
    .withMessage("Must select a category for the question posted."),
];

const validateAnswer = [
  check('body')
    .exists({ checkFalsy: true })
    .withMessage('Answer cannot be empty')
];

router.get(
  "/delete/:id",
  asyncHandler(async (req, res) => {
    console.log(`\n\n\n\n\n ${req.params.id} \n\n\n\n\n`)
    const questionId = parseInt(req.params.id, 10);
    const specificQuestion = await db.Question.findByPk(questionId);
    const answers = await db.Answer.findAll({
      where: { questionId }
    })
    answers.forEach(async (answer) => {
      await answer.destroy()
    })

    await specificQuestion.destroy()

    res.redirect(`/users/${specificQuestion.userId}`)
  }
  )
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    const questionDate = getDate;
    const questions = await db.Question.findAll({
      include: [db.User],
      // where: {
      //   userId
      // },
      order: [['updatedAt', 'DESC']]
    })
    // console.log(questions)
    res.render('all-questions', {
      questions,
      questionDate,
      userId
    })
  })
)

router.get(
  "/new",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const categories = await db.Category.findAll();
    const userId = res.locals.user.id
    let categoryArr = [];
    categories.forEach(el => categoryArr.push(el))

    res.render('new-question', {
      userId,
      categoryArr,
      csrfToken: req.csrfToken(),
    });
  }
  ))

router.post('/:id/answers/new',
  csrfProtection,
  validateAnswer,
  asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    const idQuestion = parseInt(req.params.id, 10);
    const question = await db.Question.findByPk(idQuestion, {
      include: [db.User],
    });
    const { body, questionId } = req.body;
    const answer = Answer.build({ body, questionId: idQuestion, userId: userId, votes: 0 })

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      await answer.save();
      res.redirect(`/questions/${question.id}`)
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render('specific-question', {
        title: 'Specific Question',
        userId,
        questionId,
        title,
        body,
        errors,
        csrfToken: req.csrfToken(),
      })
    }
  }))


router.post(
  "/answers/delete/:id",
  asyncHandler(async (req, res) => {
    const answerId = req.params.id
    const answer = await db.Answer.findByPk(answerId)
    const questionId = answer.questionId
    await answer.destroy()
    res.redirect(`/questions/${questionId}`)
  }
  )
);


router.post('/answers/:id/edit',
  csrfProtection,
  asyncHandler(async (req, res) => {
    const answerId = req.params.id;
    const answer = await Answer.findByPk(answerId)
    const { body } = req.body

    answer.body = body
    await answer.save()
    res.redirect(`/questions/${answer.questionId}`)

  }))


router.post(
  "/new",
  csrfProtection,
  validateQuestion,
  asyncHandler(async (req, res, next) => {
    const userId = res.locals.user.id;
    const { title, body, categoryId } = req.body;
    let categoryArr = [];
    const categories = await db.Category.findAll();
    categories.forEach(category => categoryArr.push(category));
    // console.log(categoryId)
    const question = Question.build({ title, body, categoryId, userId: res.locals.user.id, votes: 0 });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      await question.save();
      res.redirect(`/users/${res.locals.user.id}`);
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render('new-question', {
        title: 'New Question',
        userId,
        title,
        body,
        categoryId,
        categoryArr,
        errors,
        csrfToken: req.csrfToken(),
      })
    }
  })
)

router.get(
  '/:id',
  csrfProtection,
  asyncHandler(async (req, res, next) => {
    const userId = req.session.auth.userId
    const questionDate = getDate;
    const categoryArr = await db.Category.findAll()
    const questionId = parseInt(req.params.id, 10);
    const question = await db.Question.findByPk(questionId, {
      include: [db.User],
    });
    const answers = await db.Answer.findAll({
      where: {
        questionId
      },
      include: [db.User],
      order: [['createdAt', 'DESC']]
    });

    if (question) {
      res.render('specific-question', {
        user: req.session.auth.userId,
        userId,
        categoryArr,
        answers,
        question,
        userId,
        questionDate,
        csrfToken: req.csrfToken()
      });
    } else {
      next(questionNotFoundError(req.params.id));
    }
  })
);

router.get('/:id/delete', csrfProtection, asyncHandler(async (req, res) => {
  const questionId = parseInt(req.params.id, 10);
  const userId = req.session.auth.userId
  const questionDate = getDate;
  const question = await db.Question.findByPk(questionId, {
    include: db.User
  });
  const answers = await db.Answer.findAll({
    where: {
      questionId
    },
    include: [db.User],
    order: [['createdAt', 'DESC']]
  });

  res.render('specific-question-delete', {
    answers,
    userId,
    question,
    questionDate,
    csrfToken: req.csrfToken(),
  });


}));

router.post('/edit/:id', csrfProtection, asyncHandler(async (req, res) => {
  const userId = req.session.auth.userId
  const questionDate = getDate;
  const categoryArr = await db.Category.findAll()
  const questionId = parseInt(req.params.id, 10);
  const question = await db.Question.findByPk(questionId, {
    include: [db.User],
  });
  const answers = await db.Answer.findAll({
    where: {
      questionId
    },
    include: [db.User],
    order: [['createdAt', 'DESC']]
  });


  const { title, body } = req.body;
  question.title = title;
  question.body = body;

  await question.save()

  if (question) {
    res.render('specific-question', {
      user: req.session.auth.userId,
      categoryArr,
      answers,
      question,
      userId,
      questionDate,
      csrfToken: req.csrfToken()
    });

  }
}));




module.exports = router;
