import { Book } from '../Book';
import { BookRepository } from '../repositories/BookRepository';

export interface GetMyBooksUseCaseInput {
    userId: number;
}

export class GetMyBooksUseCase {
    constructor(private readonly bookRepository: BookRepository) { }

    async execute(input: GetMyBooksUseCaseInput): Promise<Book[]> {
        return this.bookRepository.findByOwnerId(input.userId);
    }
}