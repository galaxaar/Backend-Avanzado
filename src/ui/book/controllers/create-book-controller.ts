import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { CreateBookUseCase } from '../../../domain/book/use-cases/create-book';
import { PrismaBookRepository } from '../../../infrastructure/book/repositories/PrismaBookRepository';
import { bookFieldsSchema } from '../validators/books-fields-schema';

export const createBookController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, price, author } = bookFieldsSchema.parse(req.body);

        const bookRepository = new PrismaBookRepository();
        const createBookUseCase = new CreateBookUseCase(bookRepository);

        const newBook = await createBookUseCase.execute({
            title,
            description,
            price,
            author,
            ownerId: req.userId!, //nunca va a ser nulo debido a la proteccion del los middlewares
        });

        res.status(201).json(newBook);
    } catch (error) {
        next(error);
    }
};