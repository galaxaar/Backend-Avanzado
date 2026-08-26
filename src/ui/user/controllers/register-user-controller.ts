import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { CreateUserUseCase } from '../../../domain/user/use-cases/create-user';
import { SecurityServiceImplementation } from '../../../infrastructure/user/services/SecurityServiceImplementation';
import { PrismaUserRepository } from '../../../infrastructure/user/repositories/PrismaUserRepository';

const registerUserSchema = z.object({
    email: z.string().min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
});

export const registerUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = registerUserSchema.parse(req.body);

        const securityService = new SecurityServiceImplementation();
        const userRepository = new PrismaUserRepository();

        const createUserUseCase = new CreateUserUseCase(userRepository, securityService);

        await createUserUseCase.execute({ email, password });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        next(error);
    }
};