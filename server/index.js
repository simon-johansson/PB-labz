/* eslint consistent-return:0 */

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const logger = require('./logger');

const argv = require('minimist')(process.argv.slice(2));
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const resolve = require('path').resolve;
const app = express();

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

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


// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended port number, use port 3000 if not provided
const port = argv.port || process.env.PORT || 3000;

// Start your app.
app.listen(port, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr);
      }

      logger.appStarted(port, url);
    });
  } else {
    logger.appStarted(port);
  }
});
