'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users =  await queryInterface.bulkInsert('Users', [
            { username: 'Donny123', email: 'w1984@w1984.com', hashedPassword: await bcrypt.hash('password', 10)},
            { username: 'Getgainz', email: 'hotjl@hotjl.com', hashedPassword: await bcrypt.hash('password', 10)},
            { username: 'Madison', email: 'Madison@test.com', hashedPassword: await bcrypt.hash('password', 10)},
            { username: 'David', email: 'David@test.com', hashedPassword: await bcrypt.hash('password', 10)},
        ], {fields: ['username', 'email', 'hashedPassword'], returning: true});

    const categories = await queryInterface.bulkInsert('Categories', [
            { name: 'Diet' },
            { name: 'Strength Training'},
            { name: 'Body Building'},
            { name: 'Cardio'},
            { name: 'Weight Training'},
            { name: 'Cross Training'},
            { name: 'Interval Training'},
        ], {fields: ['name'], returning: true});

    const questions = await queryInterface.bulkInsert('Questions', [
            { title: 'Are eggs bad for you?', body: 'Is it true that eating more than 3 eggs a day THAT bad for you?', userId: 1, categoryId: 1, votes:0},
            { title: 'Should I do strength training workout in the morning or at night?', body: 'What is the best optimal time to strength train? Or am I just thinking too much into it?', userId: 2, categoryId: 2, votes:0},
            { title: 'Body Building and steroids', body: 'I am trying to get into body building and was wondering if I would have to take steroids to look like them?', userId: 3, categoryId: 3, votes:0},
            { title: 'I HATE CARDIO', body: 'How do you guys have the disciple to do cardio? Runners high does not work for me.', userId: 4, categoryId: 4, votes:0},
            { title: 'Free weights or machine', body: 'I am starting off my fitness journey and was confused on where to start. Should I focus more on free weights or just use the machines they have at the gym?', userId: 1, categoryId: 5, votes:0},
            { title: 'Time distribution', body: 'How many exercises and time should we allocate for each workout?', userId: 2, categoryId: 6, votes:0},
            { title: 'Why is interval training important?', body: 'What are the benefits if I include this in my workout regimen?', userId:3, categoryId: 7, votes:0},
        ], {fields: ['title', 'body', 'userId', 'categoryId', 'votes'], returning: true});

    const answers = await queryInterface.bulkInsert('Answers', [
            { body: 'Eggs can be bad if you have high cholesterol. Eat in moderation boy/girl!', userId: 2, questionId: 1},
            { body: 'Eggs are lowkey nasty', userId: 4, questionId: 1},
            { body: 'I usually just eat the egg whites, but I have them quite often, so far so good!', userId: 3, questionId: 1},
            { body: 'Turns out I have high cholesterol', userId: 2, questionId: 1},
            { body: 'Does not matter! Whenever you feel energized I say go for it!', userId: 1, questionId: 2},
            { body: 'Are you seriously asking this? Some do and some do not. Just put the work in and you should be fine.', userId: 1, questionId: 3},
            { body: 'I try to run in a area with nice scenery so I can enjoy running!', userId: 2, questionId: 4},
            { body: 'I would say start out with machines and work on free weights when you feel comfortable. You got this!', userId: 4, questionId: 5},
            { body: 'Depends on your free time and equipment you have.', userId: 3, questionId: 6},
            { body: 'Switching your workouts help develop your muscles better from time to time.', userId: 4, questionId: 7},
        ], {fields: ['body', 'userId', 'questionId'], returning: true});

     /*await queryInterface.bulkInsert('Votes', [
            { value: true, userId: 1, answerId: 1},
            { value: false, userId: 2, answerId: 2},
            { value: false, userId: 3, answerId: 3},
            { value: false, userId: 4, answerId: 4},
            { value: true, userId: 1, answerId: 5},
            { value: true, userId: 2, answerId: 6},
            { value: false, userId: 3, answerId:7},
        ], {fields: ['value', 'userId', 'answerId'], returning: true});*/
  },

  down: async (queryInterface, Sequelize) => {

        await queryInterface.bulkDelete('Answers', null, {});
        await queryInterface.bulkDelete('Questions', null, {});
        await queryInterface.bulkDelete('Categories', null, {});
        await queryInterface.bulkDelete('Users', null, {});
         //await queryInterface.bulkDelete('Votes', null, {});
  },
};
