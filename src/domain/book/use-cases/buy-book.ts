import { BusinessConflictError } from '../../errors/BusinessConflictError';
import { EntityNotFoundError } from '../../errors/EntityNotFoundError';
import { ForbiddenOperationError } from '../../errors/ForbiddenOperationError';
import { QueueService } from '../../shared/QueueService';
import { Book } from '../Book';
import { BookRepository } from '../repositories/BookRepository';

export interface BuyBookUseCaseInput {
    id: number;
    buyerId: number;
}

export class BuyBookUseCase {
    constructor(
        private readonly bookRepository: BookRepository,
        private readonly queueService: QueueService,
    ) { }

    async execute(input: BuyBookUseCaseInput): Promise<Book> {
        const book = await this.bookRepository.findById(input.id);

        if (!book) {
            throw new EntityNotFoundError('Book', input.id.toString());
        }

        if (book.status === 'SOLD') {
            throw new BusinessConflictError('This book has already been sold');
        }

        if (book.ownerId === input.buyerId) {
            throw new ForbiddenOperationError('You cannot buy your own book');
        }

        const soldBook = await this.bookRepository.markAsSold(input.id, new Date());

        this.queueService.sendBookSoldEmail({
            sellerId: soldBook.ownerId,
            bookTitle: soldBook.title,
            bookPrice: soldBook.price,
        });

        return soldBook;
    }
}