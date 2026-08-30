import request from 'supertest';
import { api } from '../api';
import { prisma } from './test-utils/prisma-client';
import { createUser, signinUser } from './test-utils/create-user';
import { createBook } from './test-utils/create-book';
import { environmentService } from '../infrastructure/EnvironmentService';

//POST/books/:id/buy

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


describe('POST /books/:id/buy', () => {
    
    // Compra correcta
    test('Returns a 200 status code and marks the book as sold when the purchase is valid', async () => {
        await createUser({ email: 'seller@test.com' });
        const seller = await prisma.user.findUniqueOrThrow({ where: { email: 'seller@test.com' } });
        const book = await createBook({ ownerId: seller.id });

        await createUser({ email: 'buyer@test.com' });
        const buyerToken = await signinUser({ email: 'buyer@test.com' });

        const response = await request(api)
            .post(`/books/${book.id}/buy`)
            .set('Authorization', `Bearer ${buyerToken}`);

        expect(response.status).toEqual(200);
        expect(response.body.status).toEqual('SOLD');
        expect(response.body.soldAt).not.toBeNull();

        const bookInDb = await prisma.book.findUnique({ where: { id: book.id } });
        expect(bookInDb?.status).toEqual('SOLD');
        expect(bookInDb?.soldAt).not.toBeNull();
    });

    // Libro inexistente
    test('Returns a 404 status code when the book does not exist', async () => {
        await createUser({ email: 'buyer@test.com' });
        const buyerToken = await signinUser({ email: 'buyer@test.com' });

        const response = await request(api)
            .post('/books/999999/buy')
            .set('Authorization', `Bearer ${buyerToken}`);

        expect(response.status).toEqual(404);
    });

    //Libro ya vendido
    test('Returns a 409 status code when the book has already been sold', async () => {
        await createUser({ email: 'seller@test.com' });
        const seller = await prisma.user.findUniqueOrThrow({ where: { email: 'seller@test.com' } });
        const book = await createBook({ ownerId: seller.id, status: 'SOLD' });

        await createUser({ email: 'buyer@test.com' });
        const buyerToken = await signinUser({ email: 'buyer@test.com' });

        const response = await request(api)
            .post(`/books/${book.id}/buy`)
            .set('Authorization', `Bearer ${buyerToken}`);

        expect(response.status).toEqual(409);
    });

    //Compra de un libro propuo
    test('Returns a 403 status code when the buyer is the owner of the book', async () => {
        await createUser({ email: 'seller@test.com' });
        const sellerToken = await signinUser({ email: 'seller@test.com' });
        const seller = await prisma.user.findUniqueOrThrow({ where: { email: 'seller@test.com' } });
        const book = await createBook({ ownerId: seller.id });

        const response = await request(api)
            .post(`/books/${book.id}/buy`)
            .set('Authorization', `Bearer ${sellerToken}`);

        expect(response.status).toEqual(403);
    });
});