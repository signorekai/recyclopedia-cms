module.exports = ({ env }) => ({
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
    },
  },
  upload: {
    config: {
      provider: "strapi-provider-upload-aws-s3-advanced",
      providerOptions: {
        accessKeyId: env("AWS_ACCESS_KEY_ID"),
        secretAccessKey: env("AWS_ACCESS_SECRET"),
        region: env("AWS_REGION"),
        params: {
          ACL: "public-read",
          CacheControl: "public, max-age=31536000, immutable",
          bucket: env("AWS_BUCKET"),
        },
        endpoint: env("AWS_ENDPOINT"),
        baseUrl: env("CDN_BASE_URL"), // e.g. https://cdn.example.com, this is stored in strapi's database to point to the file
        prefix: env("BUCKET_PREFIX"), // e.g. strapi-assets, note the missing slash at the start
      },
      breakpoints: {
        xlarge: 1400,
        large: 1000,
        medium: 750,
        small: 500,
        thumbnail: 250,
      },
    },
  },
  ezforms: {
    config: {
      captchaProvider: {
        name: "none",
      },
      notificationProviders: [],
    },
  },
  publisher: {
    enabled: true,
  },
  "entity-notes": {
    enabled: true,
  },
  transformer: {
    enabled: true,
    config: {
      prefix: "/api/",
      responseTransforms: {
        removeAttributesKey: true,
        removeDataKey: true,
      },
    },
  },
});
