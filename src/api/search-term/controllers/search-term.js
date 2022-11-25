"use strict";

/**
 * search-term controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::search-term.search-term",
  ({ strapi }) => ({
    async upsert(ctx) {
      console.log(11, ctx.request.body);
      const entry = await strapi.entityService.findMany(
        "api::search-term.search-term",
        {
          filters: {
            term: {
              $eqi: ctx.request.body.data.term,
            },
          },
        }
      );

      if (entry.length === 0) {
        // no result
        const result = await strapi.entityService.create(
          "api::search-term.search-term",
          {
            data: {
              term: ctx.request.body.data.term.toLowerCase(),
              hits: 1,
              visitedAt: [new Date().toISOString()],
            },
          }
        );
      } else {
        const data = {
          hits: Number(entry[0].hits) + 1,
          visitedAt: entry[0].visitedAt,
        };
        data.visitedAt.push(new Date().toISOString());

        const result = await strapi.entityService.update(
          "api::search-term.search-term",
          entry[0].id,
          {
            data,
          }
        );
      }

      ctx.body = "OK";
    },
  })
);
