/* eslint-disable global-require */
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const compression = require('compression');
const pkg = require(path.resolve(process.cwd(), 'package.json'));

// Dev middleware
const addDevMiddlewares = (app, webpackConfig) => {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  const middleware = webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    silent: true,
    stats: 'errors-only',
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  // Since webpackDevMiddleware uses memory-fs internally to store build
  // artifacts, we use it instead
  const fs = middleware.fileSystem;

  if (pkg.dllPlugin) {
    app.get(/\.dll\.js$/, (req, res) => {
      const filename = req.path.replace(/^\//, '');
      res.sendFile(path.join(process.cwd(), pkg.dllPlugin.path, filename));
    });
  }

  app.post('/matchandeRekryteringsbehov', (req, res) => {
    const url = 'http://pilot.arbetsformedlingen.se:80/pbv3api/rest/matchning/v1/matchandeRekryteringsbehov';
    // console.log(req.body);
    request.post(url, {json: req.body}, (error, response, body) => {
      if (!error) {
        // console.log(body);
        res.json(body);
      }
    });
  });

  app.post('/matchandeRekryteringsbehov/:id', (req, res) => {
    const url = 'http://pilot.arbetsformedlingen.se:80/pbv3api/rest/matchning/v1/matchandeRekryteringsbehov/' + req.params.id;
    // console.log(req.body);
    request.post(url, {json: req.body}, (error, response, body) => {
      if (!error) {
        // console.log(body);
        res.json(body);
      }
    });
  });

  app.get('/matchningskriterier', (req, res) => {
    // console.log(req);
    const url = 'http://pilot.arbetsformedlingen.se:80/pbv3api/rest/af/v1/matchning' + req.originalUrl;
    // console.log(req.body);
    request(url, (error, response, body) => {
      if (!error) {
        console.log(body);
        res.json(body);
      }
    });
  });

  app.get('*', (req, res) => {
    fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
      if (err) {
        res.sendStatus(404);
      } else {
        res.send(file.toString());
      }
    });
  });
};

// Production middlewares
const addProdMiddlewares = (app, options) => {
  const publicPath = options.publicPath || '/';
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'build');

  // compression middleware compresses your server responses which makes them
  // smaller (applies also to assets). You can read more about that technique
  // and other good practices on official Express.js docs http://mxs.is/googmy
  app.use(compression());
  app.use(publicPath, express.static(outputPath));

  app.post('/matchandeRekryteringsbehov', (req, res) => {
    const url = 'http://pilot.arbetsformedlingen.se:80/pbv3api/rest/matchning/v1/matchandeRekryteringsbehov';
    // console.log(req.body);
    request.post(url, {json: req.body}, (error, response, body) => {
      if (!error) {
        // console.log(body);
        res.json(body);
      }
    });
  });

  app.post('/matchandeRekryteringsbehov/:id', (req, res) => {
    const url = 'http://pilot.arbetsformedlingen.se:80/pbv3api/rest/matchning/v1/matchandeRekryteringsbehov/' + req.params.id;
    // console.log(req.body);
    request.post(url, {json: req.body}, (error, response, body) => {
      if (!error) {
        // console.log(body);
        res.json(body);
      }
    });
  });

  app.get('*', (req, res) => res.sendFile(path.resolve(outputPath, 'index.html')));
};

/**
 * Front-end middleware
 */
module.exports = (app, options) => {
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    addProdMiddlewares(app, options);
  } else {
    const webpackConfig = require('../../internals/webpack/webpack.dev.babel');
    addDevMiddlewares(app, webpackConfig);
  }

  return app;
};
