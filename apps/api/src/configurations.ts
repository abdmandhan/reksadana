export const configurations = () => ({
  frontendHost: process.env['NEXTAUTH_URL'] || 'http://localhost:3000',
  backendHost:
    process.env['NEXT_PUBLIC_BACKEND_HOST'] || 'http://localhost:3601',
  app: {
    name: 'URS API',
    port: parseInt(process.env['API_PORT'] || '3400', 10),
    env: process.env['APP_ENV'] || 'development', //dev|uat|prod
  },
  jwt: {
    secret: process.env['JWT_SECRET'] || 'secret',
    expireIn: process.env['JWT_EXPIRE_IN'] || '90d',
  },
  aws: {
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
    bucket: process.env['AWS_BUCKET'],
    domain: process.env['AWS_DOMAIN'],
    expiresSignedFile: process.env['AWS_EXPIRES_SIGNED_FILE'] || 60 * 60 * 60,
  },
  mail: {
    host: process.env['MAIL_HOST'],
    port: process.env['MAIL_PORT'],
    user: process.env['MAIL_USER'],
    password: process.env['MAIL_PASSWORD'],
  },
});
