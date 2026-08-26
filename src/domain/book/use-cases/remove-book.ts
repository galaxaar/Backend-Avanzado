import { BusinessConflictError } from '../../errors/BusinessConflictError';
import { EntityNotFoundError } from '../../errors/EntityNotFoundError';
import { ForbiddenOperationError } from '../../errors/ForbiddenOperationError';
import { BookRepository } from '../repositories/BookRepository';

export interface RemoveBookUseCaseInput {
    id: number;
    userId: number;
}

export class RemoveBookUseCase {
    constructor(private readonly bookRepository: BookRepository) { }

    async execute(input: RemoveBookUseCaseInput): Promise<void> {
        const book = await this.bookRepository.findById(input.id);

        // si no existe el libro buscado...
        if (!book) {
            throw new EntityNotFoundError('Book', input.id.toString());
        }
        //si no eres el dueño...
        if (book.ownerId !== input.userId) {
            throw new ForbiddenOperationError('Only the owner can delete this book');
        }
        //si el libro ya se vendio...
        if (book.status === 'SOLD') {
            throw new BusinessConflictError('Sold books cannot be deleted');
        }

        await this.bookRepository.remove(input.id);
    }
}