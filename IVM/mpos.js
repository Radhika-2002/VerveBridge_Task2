const fastify = require('fastify')({ logger: true })
const fastifyStatic = require('@fastify/static')
const path = require('path')

const PORT = process.env.PORT || 8080

const os = require('os')
const networkInterfaces = os.networkInterfaces()

// serve static front-end resources
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'gui')
})

fastify.register(require('./api/actions'))
fastify.register(require('./routes/gui'))

fastify.setNotFoundHandler((req, res) => {
  res.redirect('/gui/menu')
})

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '127.0.0.1' })  // Changed to listen on localhost
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()

const getNetworkAddress = () => {
  for (const name of Object.keys(networkInterfaces)) {
    for (const net of networkInterfaces[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }
  return null
}

const networkAddress = getNetworkAddress()

if (networkAddress) {
  console.log(`\nApp server IP: ${networkAddress}:${PORT}/gui/menu\n`)
} else {
  console.log('\nNo IP found for sharing over the network')
}
