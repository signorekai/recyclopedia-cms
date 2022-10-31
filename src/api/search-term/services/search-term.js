'use strict';

/**
 * search-term service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::search-term.search-term');
