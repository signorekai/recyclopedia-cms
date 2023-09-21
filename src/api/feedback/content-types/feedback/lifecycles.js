module.exports = {
  async afterCreate(event) {
    const { result, params } = event;

    await fetch(
      "https://hooks.slack.com/services/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",
      {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `New feedback received - https://cms.recyclopedia.sg/admin/content-manager/collectionType/api::feedback.feedback/${result.id}`,
        }),
      }
    );
  },
};
