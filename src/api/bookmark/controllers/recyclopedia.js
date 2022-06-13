"use strict";

/**
 * A set of functions called "actions" for `recyclopedia`
 */
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = {
  async deleteBookmark(ctx) {
    const { params, query } = ctx;
    const { contentType, slug } = params;

    const singularContentType = params.contentType.slice(0, -1);

    if (
      contentType !== "items" &&
      contentType !== "resources" &&
      contentType !== "articles"
    ) {
      return ctx.throw(400);
    }

    const where = { user: query.user };
    where[singularContentType] = { slug };

    const data = await strapi.db.query("api::bookmark.bookmark").findOne({
      populate: [singularContentType],
      where,
    });

    if (data === null) {
      return ctx.throw(400);
    } else {
      const entry = await strapi.db.query("api::bookmark.bookmark").delete({
        where: { id: data.id },
      });
      if (entry) {
        return ctx.send({}, 201);
      } else {
        return ctx.throw(500);
      }
    }

    return ctx;
  },
  async createBookmark(ctx, next) {
    const { request, params } = ctx;
    const { contentType } = params;

    const singularContentType = params.contentType.slice(0, -1);

    if (
      contentType !== "items" &&
      contentType !== "resources" &&
      contentType !== "articles"
    ) {
      return ctx.throw(400);
    }

    const where = { user: request.body.data.user };
    where[singularContentType] = request.body.data[singularContentType];

    const data = await strapi.db.query("api::bookmark.bookmark").findOne({
      populate: [singularContentType],
      where,
    });

    const newEntry = { user: request.body.data.user };
    newEntry[singularContentType] = request.body.data[singularContentType];
    newEntry.subCategory = request.body.data.subCategory || "";

    if (data === null) {
      const entry = await strapi.db.query("api::bookmark.bookmark").create({
        data: newEntry,
      });

      if (entry) {
        return ctx.send({}, 201);
      } else {
        return ctx.throw(500);
      }
    } else {
      return ctx.throw(400);
    }

    return ctx;
  },
};
