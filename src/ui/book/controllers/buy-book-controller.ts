import { NextFunction, Request, Response } from 'express';
import { BuyBookUseCase } from '../../../domain/book/use-cases/buy-book';
import { PrismaBookRepository } from '../../../infrastructure/book/repositories/PrismaBookRepository';
import { BullQueueService } from '../../../infrastructure/shared/BullQueueService';

export const buyBookController = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    const bookRepository = new PrismaBookRepository();
    const queueService = new BullQueueService();
    const buyBookUseCase = new BuyBookUseCase(bookRepository, queueService);

    try {
        const soldBook = await buyBookUseCase.execute({
            id,
            buyerId: req.userId!,
        });

        res.status(200).json(soldBook);
    } catch (error) {
        next(error);
    }
};