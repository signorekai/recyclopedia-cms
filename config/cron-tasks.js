module.exports = {
  syncViews: {
    task: async ({ strapi }) => {
      const start = new Date();
      start.setMinutes(0);
      start.setSeconds(0);
      start.setMilliseconds(0);

      const end = new Date();
      end.setMinutes(59);
      end.setSeconds(59);
      end.setMilliseconds(999);

      const cronTimeStart = new Date().getTime();

      const logs = await strapi.entityService.findMany("api::log.log", {
        sort: { dateTime: "asc" },
        filters: {
          $and: [
            {
              dateTime: { $gte: start.toISOString() },
            },
            {
              dateTime: { $lt: end.toISOString() },
            },
          ],
        },
      });

      const pages = {};
      for (const log of logs) {
        const timestamp = new Date(log.dateTime).getTime();
        const matches =
          /\/{1}(shops|items|resources|articles|donate)\/([a-zA-Z\-]+)/g.exec(
            log.path
          );

        if (matches !== null) {
          const [_, type, slug] = matches;

          if (pages.hasOwnProperty(type) === false) {
            pages[type] = {};
            pages[type][slug] = {};
            pages[type][slug][log.visitorId] = [timestamp];
          } else if (pages[type].hasOwnProperty(slug) === false) {
            pages[type][slug] = {};
            pages[type][slug][log.visitorId] = [timestamp];
          } else if (
            pages[type][slug].hasOwnProperty(log.visitorId) === false
          ) {
            pages[type][slug][log.visitorId] = [timestamp];
          } else {
            const visits = pages[type][slug][log.visitorId];

            // only count 1 visit every 5 minutes as unique
            const visitLimit = 1000 * 60 * 1;

            for (let x = 0; x < visits.length; x++) {
              const visitTimestamp = visits[x];
              if (
                timestamp > visitTimestamp &&
                visits.indexOf(timestamp) == -1 &&
                timestamp - visitTimestamp > visitLimit
              ) {
                pages[type][slug][log.visitorId].push(timestamp);
              }
            }
          }
        }
      }

      // console.log(JSON.stringify(pages, null, "  "));

      const toUpdate = { items: {}, resources: {} };
      for (const [key, entries] of Object.entries(pages)) {
        switch (key) {
          case "items":
            for (const [slug, users] of Object.entries(entries)) {
              let count = 0;
              for (const visits of Object.values(users)) {
                count += visits.length;
              }
              toUpdate.items[slug] = count;

              const [entry] = await strapi.entityService.findMany(
                "api::item.item",
                {
                  filters: { slug },
                  fields: ["visits", "id"],
                }
              );

              let currentVisit = entry.visits || 0;
              count += currentVisit;

              await strapi.entityService.update("api::item.item", entry.id, {
                data: {
                  visits: count,
                },
              });
            }
            break;

          case "donate":
          case "resources":
          case "shops":
            for (const [slug, users] of Object.entries(entries)) {
              let count = 0;
              for (const visits of Object.values(users)) {
                count += visits.length;
              }
              toUpdate.items[slug] = count;

              const [entry] = await strapi.entityService.findMany(
                "api::resource.resource",
                {
                  filters: { slug },
                  fields: ["visits", "id"],
                }
              );

              let currentVisit = entry.visits || 0;
              count += currentVisit;

              console.log(slug, entry.id, count);
              await strapi.entityService.update(
                "api::resource.resource",
                entry.id,
                {
                  data: {
                    visits: count,
                  },
                }
              );
            }
            break;
        }
      }

      console.log(toUpdate);
      const cronTimeEnd = new Date().getTime();
      console.log(
        `${start.getHours() < 10 ? `0${start.getHours()}` : start.getHours()}${
          start.getMinutes() < 10
            ? `0${start.getMinutes()}`
            : start.getMinutes()
        }H cron job took ${(cronTimeEnd - cronTimeStart) / 1000}s`
      );
    },
    options: {
      rule: "59 * * * *",
    },
  },
};
