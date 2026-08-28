import { NextFunction, Request, Response } from 'express';
import { RemoveBookUseCase } from '../../../domain/book/use-cases/remove-book';
import { PrismaBookRepository } from '../../../infrastructure/book/repositories/PrismaBookRepository';

export const removeBookController = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    const bookRepository = new PrismaBookRepository();
    const removeBookUseCase = new RemoveBookUseCase(bookRepository);

    try {
        await removeBookUseCase.execute({
            id,
            userId: req.userId!,
        });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};