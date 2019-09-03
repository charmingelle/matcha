module.exports = {
  MALE: 'male',
  FEMALE: 'female',
  HETERO: 'heterosexual',
  HOMO: 'homosexual',
  HASH_LENGTH: 16,
  HASH_CHARSET:
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_',
  NO_REPLY_EMAIL: 'noreply@matcha.com',
  HOST: process.env.MATCHA_MOD == 'dev' ? 'localhost:3000' : null,
};
