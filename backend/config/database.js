module.exports = {
  development: {
    username: 'eventuser',
    password: 'eventpass',
    database: 'eventdb',
    host: '103.4.235.10',
    port: 5432,
    dialect: 'postgres'
  },
  test: {
    username: 'eventuser',
    password: 'eventpass',
    database: 'eventdb_test',
    host: '103.4.235.10',
    port: 5432,
    dialect: 'postgres'
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres'
  }
}; 