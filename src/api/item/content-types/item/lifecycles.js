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
  const { action } = event;
  let { where, data } = event.params;

  let currentEntry = await strapi.entityService.findOne(
    "api::item.item",
    where.id,
    {
      populate: "*",
    }
  );

  console.log(data);

  const fieldExceptions = [
    "visits",
    "contentUpdatedAt",
    "updatedAt",
    "SEO",
    "recommendations",
    // "title",
    // "otherInfo",
    // "alternateSearchTerms",
    // "slug",
    // "featured",
    // "bluebin",
    // "recycleElsewhere",
    // "showSimilar",
    // "images",
    // "SEO",
  ];

  let entryChanged = false;

  for (const [key, value] of Object.entries(data)) {
    if (fieldExceptions.indexOf(key) > -1) {
      console.log("skipping", key);
      continue;
    }

    if (currentEntry.hasOwnProperty(key) === false) {
      console.log(key, "new content in field");
      entryChanged = true;
    } else if (typeof currentEntry[key] === "object") {
      if (Array.isArray(value) === false) {
        if (value === null || currentEntry[key] === null) {
          // is `null`
          if (value !== currentEntry[key]) {
            console.log(
              key,
              "either current entry / updated entry is not null"
            );
            entryChanged = true;
          }
        } else if (typeof value === "number") {
          // oneToOne relation
          if (value !== currentEntry[key].id) {
            console.log(key, "oneToOne relation changed");
            entryChanged = true;
          }
        } else if (value.id !== currentEntry[key].id) {
          // is `object`
          console.log(key, "object is different", value, currentEntry[key]);
          entryChanged = true;
        }
      } else {
        // is `array` and same length
        value.every((item, index) => {
          if (
            typeof item === "object" &&
            item.id !== currentEntry[key][index].id
          ) {
            // somehow image uploads do return an object
            console.log(key, "image upload changed");
            entryChanged = true;
            return false;
          } else if (
            typeof item !== "object" &&
            (index >= currentEntry[key].length ||
              item !== currentEntry[key][index].id)
          ) {
            console.log(
              key,
              "ManyToMany relation / repeatable component changed"
            );
            entryChanged = true;
            return false;
          }
          return true;
        });
      }
    } else {
      entryChanged = value !== currentEntry[key];
      if (entryChanged) {
        console.log(key, "not object / array and not the same");
      }
    }

    // entryChanged =
    //   currentEntry.hasOwnProperty(key) === false ||
    //   (typeof value === "object" &&
    //     value !== null &&
    //     JSON.stringify(value) !== JSON.stringify(currentEntry[key])) ||
    //   currentEntry[key] !== value;

    // console.log(key, entryChanged);

    // if (typeof value === "object" || entryChanged) {
    //   console.log(98, key, currentEntry[key], value);
    // }

    console.log(key, entryChanged);

    if (entryChanged) break;
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
