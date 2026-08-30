import request from 'supertest';
import { api } from '../api';
import { prisma } from './test-utils/prisma-client';
import { createUser, signinUser } from './test-utils/create-user';
import { environmentService } from '../infrastructure/EnvironmentService';

//POST/books

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

describe('POST /books', () => {
    //Creación correcta
    test('Returns a 201 status code and the created book when data is valid', async () => {
        await createUser({ email: 'seller@test.com' });
        const token = await signinUser({ email: 'seller@test.com' });

        const response = await request(api)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Clean Code',
                description: 'A book about writing clean, maintainable code.',
                price: 20,
                author: 'Robert C. Martin',
            });

        expect(response.status).toEqual(201);
        expect(response.body.title).toEqual('Clean Code');
        expect(response.body.description).toEqual('A book about writing clean, maintainable code.');
        expect(response.body.price).toEqual(20);
        expect(response.body.author).toEqual('Robert C. Martin');
        expect(response.body.status).toEqual('PUBLISHED');
        expect(response.body.soldAt).toBeNull();
        expect(response.body.id).toBeDefined();
        expect(response.body.ownerId).toBeDefined();
        expect(response.body.createdAt).toBeDefined();

        const bookInDb = await prisma.book.findUnique({ where: { id: response.body.id } });
        expect(bookInDb).toBeDefined();
    });

    //Usuario no autenticado
    test('Returns a 401 status code when the user is not authenticated', async () => {
        const response = await request(api).post('/books').send({
            title: 'Clean Code',
            description: 'A book about writing clean, maintainable code.',
            price: 20,
            author: 'Robert C. Martin',
        });

        expect(response.status).toEqual(401);
    });

    //Datos inválidos
    test('Returns a 400 status code when data is invalid', async () => {
        await createUser({ email: 'seller@test.com' });
        const token = await signinUser({ email: 'seller@test.com' });

        const missingTitleResponse = await request(api)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send({
                description: 'A book about writing clean, maintainable code.',
                price: 20,
                author: 'Robert C. Martin',
            });
        expect(missingTitleResponse.status).toEqual(400);

        const shortDescriptionResponse = await request(api)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Clean Code',
                description: 'too short',
                price: 20,
                author: 'Robert C. Martin',
            });
        expect(shortDescriptionResponse.status).toEqual(400);

        const negativePriceResponse = await request(api)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Clean Code',
                description: 'A book about writing clean, maintainable code.',
                price: -5,
                author: 'Robert C. Martin',
            });
        expect(negativePriceResponse.status).toEqual(400);
    });
});