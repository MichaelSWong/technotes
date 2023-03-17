import express from 'express';
import OS from 'os';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import colors from 'colors';
import rootRoutes from './routes/root';
import { logger, logEvents } from './middleware/logger';
import errorHandler from './middleware/errorHandler';
import corsOptions from './config/corsOptions';
import connectDB from './config/dbConn';
import mongoose from 'mongoose';

colors.enable();
dotenv.config();

connectDB();

const app = express();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.SERVER_PORT || 3500;
const hostName = OS.hostname();

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', rootRoutes);

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('text').send('404 Not Found');
  }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB'.cyan.underline);
  app.listen(PORT, () =>
    console.log(
      `⚡️[server]: Server is running in ${process.env.NODE_ENV} mode on port ${PORT}, on host ${hostName}`
        .yellow.bold
    )
  );
});

mongoose.connection.on('error', (err) => {
  console.log(err.red.underline.bold);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostName}`,
    'mongoErrLog.log'
  );
});
