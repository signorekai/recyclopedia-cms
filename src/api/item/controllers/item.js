"use strict";

/**
 *  item controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::item.item", ({ strapi }) => ({
  async updateNoDate(ctx) {
    const results = await strapi
      .service("api::helpers.content-updated-at")
      .updateNoDate("api::item.item");

    ctx.type = "application/json";
    ctx.body = results;
  },
}));
