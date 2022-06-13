module.exports = {
  routes: [
    {
      method: "POST",
      path: "/bookmarks/:contentType/:slug",
      handler: "recyclopedia.createBookmark",
    },
    {
      method: "DELETE",
      path: "/bookmarks/:contentType/:slug",
      handler: "recyclopedia.deleteBookmark",
    },
  ],
};
