import * as dotenv from 'dotenv';
import * as Joi from 'joi';
dotenv.config();

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .required()
      .valid('development', 'production', 'test', 'staging'),
    PORT: Joi.number().default(8080).required(),
    ENVIRONMENT: Joi.string().default('staging'),
    FRONTEND_APP_URL: Joi.string().label('Frontend APP URL'),
    API_DOMAIN: Joi.string().description('API Domain'),
    ENFORCE_SSL: Joi.bool()
      .default(false)
      .description('This is to determine whether to use HTTP or HTTPS'),
    USE_PORT: Joi.bool()
      .default(false)
      .description('This is to determine whether to use the PORT value'),
    POSTGRES_DATABASE_URL: Joi.string().label('POSTGRES Database URL'),
    MONGO_DATABASE_URL: Joi.string().label('MONGO Database URL'),
    APP_NAME: Joi.string().required().label('App Name').default('Nest App'),
    JWT_ACCESS_TOKEN_EXPIRES: Joi.string()
      .default('1h')
      .label('JWT Access Token Expires')
      .required(),
    JWT_REFRESH_TOKEN_EXPIRES: Joi.string()
      .default('24h')
      .label('JWT Refresh Token Expires')
      .required(),
    MAIL_FROM: Joi.string().required().label('Mail From').required(),
    MAIL_USER: Joi.string().required().label('Mail User').required(),
    MAIL_PASSWORD: Joi.string().required().label('Mail Password').required(),
    MAIL_HOST: Joi.string().required().label('Mail Host').required(),
    MAIL_PORT: Joi.number().required().label('Mail Port').required(),
  })
  .unknown();
const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default () => ({
  env: envVars.NODE_ENV,
  FRONTEND_APP_URL: envVars.FRONTEND_APP_URL,
  enviroment: envVars.ENVIROMENT,
  POSTGRES_DATABASE_URL: envVars.POSTGRES_DATABASE_URL,
  mongoDatabaseUrl: envVars.MONGO_DATABASE_URL,
  environment: envVars.ENVIRONMENT,
  port: envVars.PORT,
  appName: envVars.APP_NAME,
  jwtAccessTokenExpiration: envVars.JWT_ACCESS_TOKEN_EXPIRES,
  jwtRefreshTokenExpiration: envVars.JWT_REFRESH_TOKEN_EXPIRES,
  name: envVars.APP_NAME,
  from: envVars.MAIL_FROM,
  MAIL_HOST: envVars.MAIL_HOST,
  MAIL_PASSWORD: envVars.MAIL_PASSWORD,
  MAIL_USER: envVars.MAIL_USER,
  MAIL_PORT: envVars.MAIL_PORT,
  baseApiUrl: `${envVars.ENFORCE_SSL ? 'https' : 'http'}://${
    envVars.API_DOMAIN
  }${envVars.USE_PORT ? `:${envVars.PORT}` : ''}`,
  concurrency: parseInt(envVars.QUEUE_CONCURRENCY || '1'),
  emailQueueName: envVars.QUEUE_NAME || 'agsaap',
  pspLiveServer: envVars.PSP_LIVE_SERVER,
  connection: {
    host: envVars.REDIS_HOST,
    port: parseInt(envVars.REDIS_PORT || '6379'),
  },
  cloudinary: {
    cloudName: envVars.CLOUDINARY_NAME,
    apiKey: envVars.CLOUDINARY_API_KEY,
    apiSecret: envVars.CLOUDINARY_API_SECRET,
  },
});
