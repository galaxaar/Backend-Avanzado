import { Book } from '../Book';
import { BookRepository } from '../repositories/BookRepository';

export interface CreateBookUseCaseInput {
    title: string;
    description: string;
    price: number;
    author: string;
    ownerId: number;
}

export class CreateBookUseCase {
    constructor(private readonly bookRepository: BookRepository) { }

    async execute(input: CreateBookUseCaseInput): Promise<Book> {
        return this.bookRepository.create(input);
    }
}