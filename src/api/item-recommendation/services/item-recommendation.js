'use strict';

/**
 * item-recommendation service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::item-recommendation.item-recommendation');
