const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/api', createProxyMiddleware({
    target: 'https://api.anthropic.com',
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
    headers: {
      'x-api-key': process.env.REACT_APP_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    }
  }));
};