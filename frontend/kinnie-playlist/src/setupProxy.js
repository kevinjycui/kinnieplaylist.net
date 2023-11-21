const dotenv = require('dotenv');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(['/auth', '/api'],
    createProxyMiddleware({
      target: process.env.BACKEND_URL,
      changeOrigin: true
    }));
};
