const fp = require('fastify-plugin')
const ArangoDB = require('arangojs')
const isObject = require('lodash.isobject')

function fastifyArangoDB (fastify, options, next) {
  if (!isObject(options) || !isObject(options.config)) {
    next(
      new Error(
        'ArangoDB Database options should be an object https://github.com/arangodb/arangojs#new-database'
      )
    )
  }

  const arango = new ArangoDB.Database(options.config)

  if (options.database) {
    arango.useDatabase(options.database)
  }

  if (options.basicAuth) {
    arango.useBasicAuth(
      options.basicAuth.username,
      options.basicAuth.password
    )
  }

  fastify.decorate('arango', arango).addHook("onClose", close)

  next()
}

function close (fastify, done) {
  fastify.arango.close && fastify.arango.close()
  done()
}

module.exports = fp(fastifyArangoDB, '>=0.13.1')
