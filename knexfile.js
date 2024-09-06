// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      user:'postgres',
      password: 'Ipss',
      database: 'personManagement'
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
};
