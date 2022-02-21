module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '72259bd353f02b4d576b8e99c85c38f7'),
  },
});
