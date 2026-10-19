const express = require('express');
const cors = require('cors');
const _ = require('lodash');
const { formatedDataGame, dataGame } = require('./utils/data');
const router = require('./routes');
const convertToOpenAPI = require('./utils/convert-openapi');
const config = require('./config.js');
const rateLimiter = require('./utils/rate-limiter.js');

let apiReference;

(async () => {
   const module = await import('@scalar/express-api-reference');
   apiReference = module.apiReference;
})();

const app = express();
const port = process.env.PORT || 8888 || 3001;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');
app.use(express.json());
app.use(cors());

// Render index.ejs at /test
app.get('/test', (req, res) => {
   res.render('index');
});

if (config.useRateLimiter) {
   app.use(
      '/api/game/*',
      rateLimiter({
         endpoint: '/api/game',
         rate: {
            time: config.rateLimiter.seconds,
            limit: config.rateLimiter.maxRequests,
         },
      })
   );
}

app.get('/', (req, res) => {
   return res.json({
      name: 'Cek ID Game',
      author: 'odzreshop',
      description:
         "Hi there, this is cek id game by odzreshop. You can check your game id here. If you don't know how to use it, please check the documentation.",
   });
});

app.use('/api', router);

app.use('/api-reference', async (req, res, next) => {
   if (!apiReference) {
      const module = await import('@scalar/express-api-reference');
      apiReference = module.apiReference;
   }

   return apiReference({
      theme: 'purple',
      url: '/openapi',
   })(req, res, next);
});

app.get('/list-game', (req, res) => {
   return res.json({
      name: 'Cek Data Game',
      author: 'Achillstore',
      data: formatedDataGame,
   });
});

app.get('/openapi', (req, res) => {
   return res.status(200).json({
      openapi: '3.0.0',
      info: {
         title: 'Cek ID Game by Achillstore',
         version: '1.0.0',
         description: `This is cek id game`,
         contact: {
            name: 'Achillstore',
         },
      },
      paths: {
         openapi: {
            get: {
               summary: 'Open Api JSON',
               operationId: 'openapi',
               tags: ['Open Api JSON'],
               // responses: {
               //    200: {
               //       description: 'Successful response',
               //       content: {
               //          'application/json': {
               //             schema: { type: 'object' },
               //          },
               //       },
               //    },
               // },
            },
         },
         ...convertToOpenAPI(formatedDataGame, dataGame),
      },
      tags: [
         {
            name: 'Open Api JSON',
            description: 'This is open api json for check id game',
         },
         {
            name: 'List Zone',
            description: 'This is list zone for check id game',
         },
         {
            name: 'List Game',
            description: 'This is list game for check id game',
         },
      ],
   });
});

app.get('/*', (req, res) => {
   res.status(404).json({ error: 'Kembalilah ke jalan yang benar' });
});

app.listen(port, () => {
   console.log(`Cek Id Game Starting, http://localhost:${port}`);
});

module.exports = app;
