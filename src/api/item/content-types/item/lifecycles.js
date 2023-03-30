const handler = async (event) => {
  const { result, action, params, em } = event;

  // console.log(params.data.recommendations);

  // // checking recommendations
  // if (!!result.temp.action && result.temp.action === "beforeUpdate") {
  //   const previousState = result.temp.data;
  //   const currentState = await strapi.entityService.findOne(
  //     "api::item.item",
  //     params.where.id,
  //     {
  //       populate: ["recommendations.resources"],
  //     }
  //   );

  //   const previousRecommendations = {};
  //   previousState.recommendations.map((recommendation) => {
  //     previousRecommendations[recommendation.id] = recommendation.resources.map(
  //       (resource) => resource.id
  //     );
  //   });

  //   const currentRecommendations = {};
  //   currentState.recommendations.map((recommendation) => {
  //     currentRecommendations[recommendation.id] = recommendation.resources.map(
  //       (resource) => resource.id
  //     );
  //   });

  //   console.log(previousRecommendations, currentRecommendations);

  //   for (const [recommendationKey, recommendation] of Object.entries(
  //     currentRecommendations
  //   )) {
  //     if (!!previousRecommendations[recommendationKey]) {
  //       recommendation.map((resourceId) => {
  //         console.log(recommendationKey, resourceId);
  //         if (
  //           previousRecommendations[recommendationKey].indexOf(resourceId) > -1
  //         ) {
  //           currentRecommendations[recommendationKey] = currentRecommendations[
  //             recommendationKey
  //           ].filter((v) => v !== resourceId);
  //           previousRecommendations[recommendationKey] =
  //             previousRecommendations[recommendationKey].filter(
  //               (v) => v !== resourceId
  //             );
  //         }
  //       });
  //     }
  //   }

  //   console.log("old", previousRecommendations, "new", currentRecommendations);
  // }
};

const beforeUpdateHandler = async (event) => {
  let { data, where } = event.params;

  const newData = await strapi
    .service("api::helpers.content-updated-at")
    .checkForContentUpdate({ model: "api::item.item", id: where.id, data });

  data = newData;
  return event;
};

module.exports = {
  beforeUpdate: beforeUpdateHandler,
};
