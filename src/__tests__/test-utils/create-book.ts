import { prisma } from './prisma-client';

export async function createBook(
    overrides: {
        title?: string;
        description?: string;
        price?: number;
        author?: string;
        ownerId?: number;
        status?: 'PUBLISHED' | 'SOLD';
    } = {},
) {
    let ownerId = overrides.ownerId;

    if (!ownerId) {
        const owner = await prisma.user.upsert({ //upsert en lugar de creeate para que no me cree el mismo usuario cada vez
            where: { email: 'create-book-owner@domain.com' },
            update: {},
            create: {
                email: 'create-book-owner@domain.com',
                password: 'hashedPassword123*',
            },
        });
        ownerId = owner.id;
    }

    return prisma.book.create({
        data: {
            title: 'Test Book',
            description: 'Test description long enough to pass validation rules',
            price: 19.99,
            author: 'Test Author',
            ownerId,
            ...overrides,
        },
    });
}