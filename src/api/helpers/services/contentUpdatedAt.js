"use strict";

/**
 * contentUpdatedAt-check service
 */

module.exports = ({ strapi }) => ({
  async checkForContentUpdate({
    model,
    id,
    data,
    fieldExceptions = ["visits", "contentUpdatedAt", "updatedAt"],
  }) {
    let currentEntry = await strapi.entityService.findOne(model, id, {
      populate: "*",
    });

    let exceptionFieldsIncluded = [];

    let entryChanged = false;

    for (const key of Object.keys(data)) {
      if (fieldExceptions.indexOf(key) === -1) {
        entryChanged = true;
      } else if (key === "contentUpdatedAt") {
        if (currentEntry[key] !== data[key] && data[key] !== null) {
          exceptionFieldsIncluded.push(key);
        }
      }
    }

    if (entryChanged && exceptionFieldsIncluded.length === 0) {
      console.log(model, "changed:", id);
      data.contentUpdatedAt = data.updatedAt;
    } else {
      console.log(
        "not updating",
        model,
        id,
        entryChanged,
        exceptionFieldsIncluded.length > 0
      );
    }

    return data;
  },
  async updateNoDate(model) {
    const entries = await strapi.entityService.findMany(model, {
      filters: {
        contentUpdatedAt: {
          $null: true,
        },
      },
    });

    console.log("fetched", entries.length, model);

    for (const entry of entries) {
      const result = await strapi.entityService.update(model, entry.id, {
        data: {
          contentUpdatedAt: entry.updatedAt,
        },
      });

      if (result) {
        console.log("updated", model, entry.id);
      } else {
        console.error("failed", model, entry.id, result);
      }
    }
    return entries;
  },
});
