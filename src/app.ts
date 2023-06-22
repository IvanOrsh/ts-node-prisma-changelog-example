import path from 'path';
import express, { type Express, Request, Response } from 'express';
import morgan from 'morgan';

import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './routes/v1';

const app: Express = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRouter);

app.all('*', (req: Request, res: Response) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.use(errorHandler);

export default app;
