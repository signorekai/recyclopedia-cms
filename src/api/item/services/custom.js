module.exports = ({ strapi }) => ({
  async updateVisit(id, count) {
    return strapi.db.query("api::item.item").update({
      where: { id },
      data: {
        visits: count,
      },
    });
  },
});
