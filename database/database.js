const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'guiapress',
  },
});

module.exports = knex
