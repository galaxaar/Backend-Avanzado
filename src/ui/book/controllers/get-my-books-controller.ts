import { NextFunction, Request, Response } from 'express';
import { GetMyBooksUseCase } from '../../../domain/book/use-cases/get-my-books';
import { PrismaBookRepository } from '../../../infrastructure/book/repositories/PrismaBookRepository';

export const getMyBooksController = async (req: Request, res: Response, next: NextFunction) => {
    const bookRepository = new PrismaBookRepository();
    const getMyBooksUseCase = new GetMyBooksUseCase(bookRepository);

    try {
        const books = await getMyBooksUseCase.execute({
            userId: req.userId!,
        });

        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
};