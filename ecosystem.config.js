module.exports = {
  apps: [
    {
      name: "recyclopedia-cms",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        AWS_REGION: "ap-south-1",
      },
    },
  ],
  // Deployment Configuration
  deploy: {
    production: {
      key: "/users/alfredlau/.ssh/recyclopedia",
      user: "alfred",
      host: ["192.53.118.42"],
      ref: "origin/master",
      repo: "git@gitlab.com:alfredlau/recyclopedia-strapi.git",
      path: "/var/www/cms",
      "post-setup": "npm run build:prod",
      "post-deploy":
        "npm run build:prod && pm2 startOrRestart ecosystem.config.js --env production",
    },
    "production:silent": {
      key: "/users/alfredlau/.ssh/recyclopedia",
      user: "alfred",
      host: ["192.53.118.42"],
      ref: "origin/master",
      repo: "git@gitlab.com:alfredlau/recyclopedia-strapi.git",
      path: "/var/www/cms",
      "post-setup": "npm run build:prod",
      "post-deploy": "pm2 startOrRestart ecosystem.config.js --env production",
    },
  },
};
