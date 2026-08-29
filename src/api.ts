import express from 'express';
import { userRouter } from './ui/user/routes/user-route';
import { errorHandlerMiddleware } from './ui/shared/middlewares/error-handler-middleware';
import { bookRouter } from './ui/book/routes/boook-route';

const api = express();

api.use(express.json());

api.use('/authentication', userRouter);
//escribimos las rutas completas dentro del propio router para lograr ese /me/books y no /books/me
api.use(bookRouter); 

api.use(errorHandlerMiddleware);

export { api };