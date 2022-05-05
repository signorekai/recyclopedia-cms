module.exports = {
  apps: [
    {
      name: "recyclopedia-cms",
      script: "strapi",
      args: "start",
      env: {
        NODE_ENV: "production",
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
      "post-deploy": "npx pm2 startOrRestart ecosystem.json --env production",
    },
  },
};
