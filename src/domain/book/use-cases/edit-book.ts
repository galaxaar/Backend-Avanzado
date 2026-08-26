import { EntityNotFoundError } from '../../errors/EntityNotFoundError';
import { ForbiddenOperationError } from '../../errors/ForbiddenOperationError';
import { Book } from '../Book';
import { BookRepository } from '../repositories/BookRepository';

export interface EditableBookFields {
    title: string;
    description: string;
    price: number;
    author: string;
}
//id y userid fuera de los campos editables 
export interface EditBookUseCaseInput extends EditableBookFields {
    id: number;
    userId: number;
}
//caso de edicion sobre un libro
export class EditBookUseCase {
    constructor(private readonly bookRepository: BookRepository) { }

    async execute(input: EditBookUseCaseInput): Promise<Book> {
        const { id, userId, ...editableFields } = input;

        const book = await this.bookRepository.findById(id);

        if (!book) {
            throw new EntityNotFoundError('Book', id.toString()); 
        }

        if (book.ownerId !== userId) {
            throw new ForbiddenOperationError('You are not the owner of this book');
        }

        return this.bookRepository.edit(id, editableFields);
    }
}