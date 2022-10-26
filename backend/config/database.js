module.exports = ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 3306),
      database: env('DATABASE_NAME', 'findik_tv'),
      user: env('DATABASE_USERNAME', 'findik_tv'),
      password: env('DATABASE_PASSWORD', 'bXL6qt2CNk9*RBxRmK'),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
