const express = require('express');
const { check } = require("express-validator");
const { asyncHandler, csrfProtection, handleValidationErrors, getDate } = require('./utils');
const { requireAuth } = require("../auth");
const router = express.Router();
const db = require('../db/models');

const { Question, User } = db;

router.use(requireAuth);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const questions = await Question.findAll({
      include: [{ model: User, as: "user", attributes: ["username"] }],
      order: [["createdAt", "DESC"]],
      attributes: ["title", "body"]
    })
    res.json({ questions });
  })
)

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
  '/:id',
  asyncHandler(async (req, res, next) => {
    const userId = req.session.auth.userId
    const questionDate = getDate;
    const questionId = parseInt(req.params.id, 10);
    const question = await db.Question.findByPk(questionId, {
      include: [db.User],
    });
    // const answers = await db.Answer.findAll({
    //     where: {
    //       questionId
    //     },
    //   include: [db.User],
    //   order: [['updatedAt', 'DESC']]
    // });
    // console.log(`\n\n\n\n\n ${answers} \n\n\n\n\n`)

    if (question) {
      res.render('specific-question', {
        user: req.session.auth.userId,
        // answers,
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
  "/",
  csrfProtection,
  validateQuestion,
  asyncHandler(async (req, res) => {
    const { title, body } = req.body;
    const question = await Question.create({ title, body, userId: req.user.id });
    res.json({ question });
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

router.get(
  "/new",
  (req, res) => {
    res.render('new-question');
  }
)

module.exports = router;
