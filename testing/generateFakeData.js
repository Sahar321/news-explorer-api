/*eslint-disable*/
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const { MakoLinks } = require('../testing/aritcleLinks');
// Assuming the models are already defined.

const User = require('../models/user');
const Article = require('../models/article');
const Comment = require('../models/comment');
const Reaction = require('../models/reaction');


async function generateFakeData() {
  const users = [];

  // 1. Create 40 users
  for (let i = 0; i < 120; i++) {
    const user = await User.create({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
    });
    users.push(user);
  }

  // 2. Create 100 articles for each user
  MakoLinks.forEach(async (itemLink) => {
    for (const user of users) {
      for (let j = 0; j < 100; j++) {
        const article = await Article.create({
          keyword: faker.lorem.word(),
          title: faker.lorem.sentence(),
          text: faker.lorem.paragraph(),
          date: faker.date.past().toISOString(),
          source: faker.company.name(),
          link: itemLink,
          image: faker.image.url(),
          owner: user._id,
        });

        // 3. Create 0-200 comments for each article
        const commentsCount = faker.datatype.number({ min: 0, max: 200 });
        for (let k = 0; k < commentsCount; k++) {
          const commentingUser =
            users[faker.datatype.number({ min: 0, max: 39 })];
          await Comment.create({
            text: faker.lorem.sentence(),
            link: article.link,
            owner: commentingUser._id,
            rating: [
              {
                userId: commentingUser._id,
                rating: faker.datatype.number({ min: 1, max: 5 }),
              },
            ],
          });
        }

        // 4. Create 20-100 reactions for each article
        const reactionsCount = faker.datatype.number({ min: 20, max: 100 });
        for (let l = 0; l < reactionsCount; l++) {
          const reactingUser = users[faker.datatype.number({ min: 0, max: 39 })];
          await Reaction.create({
            type: faker.helpers.arrayElement([
              'LOL',
              'WOW',
              'LIKE',
              'SAD',
              'LOVE',
            ]),
            date: faker.date.recent().toISOString(),
            link: article.link,
            owner: reactingUser._id,
          });
        }
      }
    }
  });

}

module.exports = generateFakeData;
