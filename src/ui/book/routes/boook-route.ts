import { Router } from 'express';
import { createBookController } from '../controllers/create-book-controller';
import { editBookController } from '../controllers/edit-book-controller';
import { removeBookController } from '../controllers/remove-book-controller';
import { buyBookController } from '../controllers/buy-book-controller';
import { findBooksController } from '../controllers/find-books-controller';
import { getMyBooksController } from '../controllers/get-my-books-controller';
import { authenticationMiddleware } from '../../user/middlewares/authentication-middleware';

export const bookRouter = Router();

bookRouter.get('/books', findBooksController);
bookRouter.post('/books', [authenticationMiddleware, createBookController]);
bookRouter.put('/books/:id', [authenticationMiddleware, editBookController]);
bookRouter.delete('/books/:id', [authenticationMiddleware, removeBookController]);
bookRouter.post('/books/:id/buy', [authenticationMiddleware, buyBookController]);
bookRouter.get('/me/books', [authenticationMiddleware, getMyBooksController]);