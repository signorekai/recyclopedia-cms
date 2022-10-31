module.exports = {
  routes: [
    {
      method: "PUT",
      path: "/search-terms/upsert",
      handler: "search-term.upsert",
    },
  ],
};
