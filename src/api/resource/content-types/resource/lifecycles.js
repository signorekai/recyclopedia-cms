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
  let { data } = event.params;

  const fieldExceptions = ["visits", "contentUpdatedAt", "updatedAt"];

  let entryChanged = false;

  for (const key of Object.keys(data)) {
    if (fieldExceptions.indexOf(key) === -1) {
      entryChanged = true;
      break;
    }
  }

  console.log("entry changed:", entryChanged);
  if (entryChanged) {
    data.contentUpdatedAt = data.updatedAt;
  }

  return event;

  // console.log(action, event.params.data.recommendations);

  // pass a copy of current data to afterUpdate as event.state is not working
  // https://forum.strapi.io/t/sharing-state-between-beforedelete-and-afterdelete-lifecycle-hooks/14149
  // https://discord.com/channels/811989166782021633/841755530007805983/960790437772292146
  // event.params.data.temp = {
  //   action,
  //   data: current,
  // };
};

module.exports = {
  afterCreate: handler,
  beforeUpdate: beforeUpdateHandler,
  afterUpdate: handler,
};
