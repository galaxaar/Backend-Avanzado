import { Pagination } from '../../shared/Pagination';
import { Book } from '../Book';
import { BookRepository } from '../repositories/BookRepository';

//filtrado
interface BookFilterQuery {
    search?: string;
}
//busqueda con paginado y filtrado
export type FindBooksUseCaseInput = Pagination & BookFilterQuery;

export class FindBooksUseCase {
    constructor(private readonly bookRepository: BookRepository) { }

    async execute(criteria: FindBooksUseCaseInput): Promise<{ books: Book[]; total: number }> {
        return this.bookRepository.findMany(criteria);
    }
}