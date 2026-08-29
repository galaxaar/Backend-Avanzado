import { NextFunction, Request, Response } from 'express';
import { EditBookUseCase } from '../../../domain/book/use-cases/edit-book';
import { PrismaBookRepository } from '../../../infrastructure/book/repositories/PrismaBookRepository';
import { bookFieldsSchema } from '../validators/book-fields-schema';

export const editBookController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, price, author } = bookFieldsSchema.parse(req.body);
        const id = Number(req.params.id);

        const bookRepository = new PrismaBookRepository();
        const editBookUseCase = new EditBookUseCase(bookRepository);

        const updatedBook = await editBookUseCase.execute({
            id,
            userId: req.userId!,
            title,
            description,
            price,
            author,
        });

        res.status(200).json(updatedBook);
    } catch (error) {
        next(error);
    }
};