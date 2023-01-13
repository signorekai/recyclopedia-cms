module.exports = ({ env }) => [
  "strapi::errors",
  "strapi::security",
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            `${env("CDN_BASE_URL")}`,
            `https://recyclopedia.ap-south-1.linodeobjects.com`,
            `https://dl.airtable.com`,
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            `${env("CDN_BASE_URL")}`,
            `https://recyclopedia.ap-south-1.linodeobjects.com`,
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
];
