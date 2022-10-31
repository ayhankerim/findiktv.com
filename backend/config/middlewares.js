module.exports = ({ env }) => [
  'strapi::errors',
  {
    name: "strapi::security",
      config: {
      contentSecurityPolicy: {
      directives: {
      "script-src": ["'self'", "editor.unlayer.com"],
            "frame-src": ["'self'", "editor.unlayer.com"],
            // "img-src": [
            //     "'self'",
            //     "data:",
            //     "cdn.jsdelivr.net",
            //     "strapi.io",
            //     "s3.amazonaws.com",
            //   ],
          },
        },
      },
  },
  {
    name: 'strapi::poweredBy',
    config: {
      poweredBy: env('POWEREDBY'),
    },
  },
  {
    name: 'strapi::cors',
    config: {
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
