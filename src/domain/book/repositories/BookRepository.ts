import { Book } from '../Book';
import { CreateBookUseCaseInput } from '../use-cases/create-book';
import { EditableBookFields } from '../use-cases/edit-book';
import { FindBooksUseCaseInput } from '../use-cases/find-books';

export interface BookRepository {
    create: (params: CreateBookUseCaseInput) => Promise<Book>;
    findById: (id: number) => Promise<Book | null>;
    edit: (id: number, params: EditableBookFields) => Promise<Book>;
    remove: (id: number) => Promise<void>;
    markAsSold: (id: number, soldAt: Date) => Promise<Book>;
    findByOwnerId: (ownerId: number) => Promise<Book[]>;
    findMany: (criteria: FindBooksUseCaseInput) => Promise<{ books: Book[]; total: number }>;
}