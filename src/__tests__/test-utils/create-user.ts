import request from 'supertest';
import { api } from '../../api';

export async function createUser(overrides: { email: string; password?: string }) {
    const response = await request(api)
        .post('/authentication/signup')
        .send({
            password: 'TestPass123*',
            ...overrides,
        });

    if (response.status !== 201) {
        throw new Error(`createUser failed with status ${response.status}: ${JSON.stringify(response.body)}`);
    }
}

export async function signinUser(overrides: { email: string; password?: string }) {
    const response = await request(api)
        .post('/authentication/signin')
        .send({
            password: 'TestPass123*',
            ...overrides,
        });

    return response.body.accessToken;
}