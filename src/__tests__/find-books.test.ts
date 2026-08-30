import request from 'supertest';
import { api } from '../api';
import { prisma } from './test-utils/prisma-client';
import { createBook } from './test-utils/create-book';
import { environmentService } from '../infrastructure/EnvironmentService';

//GET/books

beforeAll(() => {
    environmentService.load();
});

beforeEach(async () => {
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('GET /books', () => {
    // Paginación
    test('Returns paginated results', async () => {
        await createBook({ title: 'Book One' });
        await createBook({ title: 'Book Two' });
        await createBook({ title: 'Book Three' });

        const firstPageResponse = await request(api).get('/books').query({ page: 1, limit: 2 });

        expect(firstPageResponse.status).toEqual(200);
        expect(firstPageResponse.body.data.length).toEqual(2);
        expect(firstPageResponse.body.meta).toEqual({ page: 1, limit: 2, total: 3 });

        const secondPageResponse = await request(api).get('/books').query({ page: 2, limit: 2 });

        expect(secondPageResponse.status).toEqual(200);
        expect(secondPageResponse.body.data.length).toEqual(1);
    });

    //Busqueda por titulo
    test('Returns books matching a partial title search', async () => {
        await createBook({ title: "Harry Potter and the Philosopher's Stone", author: 'J.K. Rowling' });
        await createBook({ title: 'Clean Code', author: 'Robert C. Martin' });

        const response = await request(api).get('/books').query({ search: 'potter' });

        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(1);
        expect(response.body.data[0].title).toEqual("Harry Potter and the Philosopher's Stone");
    });

    //Busqueda por autor
    test('Returns books matching a partial author search', async () => {
        await createBook({ title: "Harry Potter and the Philosopher's Stone", author: 'J.K. Rowling' });
        await createBook({ title: 'Clean Code', author: 'Robert C. Martin' });

        const response = await request(api).get('/books').query({ search: 'rowling' });

        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(1);
        expect(response.body.data[0].author).toEqual('J.K. Rowling');
    });

    //Lista sin los libros vendidos
    test('Excludes sold books from the results', async () => {
        await createBook({ title: 'Published Book', status: 'PUBLISHED' });
        await createBook({ title: 'Sold Book', status: 'SOLD' });

        const response = await request(api).get('/books');

        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(1);
        expect(response.body.data[0].title).toEqual('Published Book');
    });
});