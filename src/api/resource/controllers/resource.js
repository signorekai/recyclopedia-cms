"use strict";

/**
 *  resource controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::resource.resource",
  ({ strapi }) => ({
    async updateNoDate(ctx) {
      const results = await strapi
        .service("api::helpers.content-updated-at")
        .updateNoDate("api::resource.resource");

      ctx.type = "application/json";
      ctx.body = results;
    },
  })
);
