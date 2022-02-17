const express = require('express');
const { check, validationResult } = require("express-validator");
const { asyncHandler, csrfProtection, handleValidationErrors, getDate } = require('./utils');
const { requireAuth } = require("../auth");
const router = express.Router();
const db = require('../db/models');
const {Answer} = db

const { Question, User } = db;

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
    .withMessage("Question title cannot be over 300 characters"),
  handleValidationErrors,
];

router.get(
  "/new",
  (req, res) => {
    res.render('new-question');
  }
)

router.post(
  "/new",
  csrfProtection,
  validateQuestion,
  asyncHandler(async (req, res) => {
    const { title, body } = req.body;
    const question = await db.Question.build({ title, body, userId: req.user.id });

    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
      await question.save();
      res.redirect(`users/${req.user.id}`);
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render('new-question', {
        title: 'New Question',
        title,
        body,
        errors,
        csrfToken: req.csrfToken(),
      })
    }
  })
)

router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const userId = req.session.auth.userId
    const questionDate = getDate;
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
        answers,
        question,
        userId,
        questionDate

      });
    } else {
      next(questionNotFoundError(req.params.id));
    }
  })
);

router.post(
  "/:id/delete",
  asyncHandler(async (req, res, next) => {
    const question = await Question.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (req.user.id !== question.userId) {
      const err = new Error("Unauthorized");
      err.status = 401;
      err.message = "You do not have the right to edit this question.";
      err.title = "Unauthorized";
      throw err;
    }
    if (question) {
      await question.destroy();
      res.json({ message: `Deleted question with id of ${req.params.id}.` });
    } else {
      next(questionNotFoundError(req.params.id));
    }
  })
);


// router.delete(
//   "/:id",
//   asyncHandler(async (req, res, next) => {
//     const question = await Question.findOne({
//       where: {
//         id: req.params.id,
//       },
//     });
//     if (req.user.id !== question.userId) {
//       const err = new Error("Unauthorized");
//       err.status = 401;
//       err.message = "You do not have the right to edit this question.";
//       err.title = "Unauthorized";
//       throw err;
//     }
//     if (question) {
//       await question.destroy();
//       res.json({ message: `Deleted question with id of ${req.params.id}.` });
//     } else {
//       next(questionNotFoundError(req.params.id));
//     }
//   })
// );



module.exports = router;
