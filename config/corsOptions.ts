import allowedOrigins from './allowedOrigins';
import * as cors from 'cors';

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // !origin allows postman and curl to acces api
    if (allowedOrigins.indexOf(origin as string) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
