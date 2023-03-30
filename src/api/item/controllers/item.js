"use strict";

/**
 *  item controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::item.item", ({ strapi }) => ({
  async updateNoDate(ctx) {
    const items = await strapi.entityService.findMany("api::item.item", {
      filters: {
        contentUpdatedAt: {
          $null: true,
        },
      },
    });

    // for (const item of items) {
    const item = items[0];
    const result = await strapi.entityService.update(
      "api::item.item",
      item.id,
      {
        data: {
          contentUpdatedAt: item.updatedAt,
        },
      }
    );

    if (result) {
      console.log("updated", item.id);
    } else {
      console.error("failed", item.id, result);
    }
    // }

    ctx.type = "application/json";
    ctx.body = items;
  },
}));
