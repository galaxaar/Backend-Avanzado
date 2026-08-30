import { Book } from '../../../domain/book/Book';
import { BookRepository } from '../../../domain/book/repositories/BookRepository';
import { CreateBookUseCaseInput } from '../../../domain/book/use-cases/create-book';
import { EditableBookFields } from '../../../domain/book/use-cases/edit-book';
import { FindBooksUseCaseInput } from '../../../domain/book/use-cases/find-books';

import { prisma } from '../../prisma-client';


// Objeto que Prisma devuelve al consultar la tabla "book". La declaramos a mano para que el
// repositorio sea explicito sobre que campos espera recibir de la base de datos.
type PrismaBook = {
    id: number;
    title: string;
    description: string;
    price: number;
    author: string;
    status: string;
    ownerId: number;
    soldAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

// Implementacion real de BookRepository 
export class PrismaBookRepository implements BookRepository {
    private readonly prisma = prisma;

    // Creacion de un libro nuevo. 
    // la base de datos se encarga de rellenar los valores por defecto (PUBLISHED y null) sola.
    async create(params: CreateBookUseCaseInput): Promise<Book> {
        const prismaBook = await this.prisma.book.create({
            data: {
                title: params.title,
                description: params.description,
                price: params.price,
                author: params.author,
                ownerId: params.ownerId,
            },
        });

        // convertimos el objeto de Prisma en una instancia real de nuestra entidad Book.
        return this.restore(prismaBook);
    }

    // Busca un libro por su id. Devuelve null si no existe.
    async findById(id: number): Promise<Book | null> {
        const prismaBook = await this.prisma.book.findUnique({
            where: { id },
        });

        if (!prismaBook) {
            return null;
        }

        return this.restore(prismaBook);
    }

    // Actualiza SOLO los 4 campos editables (title, description, price, author).
    // No es posible pasar "status", "soldAt" u "ownerId" aquí porque utilizamos EditableBookFields como parametro.
    async edit(id: number, params: EditableBookFields): Promise<Book> {
        const prismaBook = await this.prisma.book.update({
            where: { id },
            data: {
                title: params.title,
                description: params.description,
                price: params.price,
                author: params.author,
            },
        });

        return this.restore(prismaBook);
    }

    // Elimina un libro de forma permanente.
    async remove(id: number): Promise<void> {
        await this.prisma.book.delete({
            where: { id },
        });
    }

    // una edición que marca el cambio de estado (que ocurre al vender un libro)
    async markAsSold(id: number, soldAt: Date): Promise<Book> {
        const prismaBook = await this.prisma.book.update({
            where: { id },
            data: {
                status: 'SOLD',
                soldAt,
            },
        });

        return this.restore(prismaBook);
    }

    // devuelve TODOS los libros de un usuario, sin filtrar por estado.
    async findByOwnerId(ownerId: number): Promise<Book[]> {
        const prismaBooks = await this.prisma.book.findMany({
            where: { ownerId },
        });

        return prismaBooks.map((prismaBook) => this.restore(prismaBook));
    }

    //catalogo publico: paginado, con busqueda opcional por titulo o autor.
    async findMany(criteria: FindBooksUseCaseInput): Promise<{ books: Book[]; total: number }> {
        const { page, limit, search } = criteria;

        // El filtro "status: PUBLISHED" 
        const where = {
            status: 'PUBLISHED' as const,
            // si el cliente mando un termino de busqueda, añadimos tambien el filtro OR
            ...(search
                ? {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' as const } },
                        { author: { contains: search, mode: 'insensitive' as const } },
                    ],
                }
                : {}),
        };

        // paginacion
        const prismaBooks = await this.prisma.book.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
        });
        const total = await this.prisma.book.count({ where });

        return {
            books: prismaBooks.map((prismaBook) => this.restore(prismaBook)),
            total,
        };
    }

    async findPublishedOlderThan(date: Date): Promise<Book[]> {
        const prismaBooks = await this.prisma.book.findMany({
            where: {
                status: 'PUBLISHED',
                createdAt: { lt: date },
            },
        });
        return prismaBooks.map((prismaBook) => this.restore(prismaBook));
    }


    private restore(prismaBook: PrismaBook): Book {
        return new Book({
            id: prismaBook.id,
            title: prismaBook.title,
            description: prismaBook.description,
            price: prismaBook.price,
            author: prismaBook.author,
            status: prismaBook.status as 'PUBLISHED' | 'SOLD',
            ownerId: prismaBook.ownerId,
            soldAt: prismaBook.soldAt,
            createdAt: prismaBook.createdAt,
            updatedAt: prismaBook.updatedAt,
        });
    }
}