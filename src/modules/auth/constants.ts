export const jwtConstants = {
  jwtSecretKey: process.env.JWT_SECRET_KEY || 'secret123123',
  jwtSecretRefreshKey: process.env.JWT_SECRET_REFRESH_KEY || 'secret123123',
  tokenExpireTime: process.env.TOKEN_EXPIRE_TIME || '1h',
  tokenRefreshExpireTime: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
};
