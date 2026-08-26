import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { LoginUserUseCase } from '../../../domain/user/use-cases/login-user';
import { SecurityServiceImplementation } from '../../../infrastructure/user/services/SecurityServiceImplementation';
import { PrismaUserRepository } from '../../../infrastructure/user/repositories/PrismaUserRepository';

const loginUserSchema = z.object({
    email: z.string().min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
});

export const loginUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = loginUserSchema.parse(req.body);

        const securityService = new SecurityServiceImplementation();
        const userRepository = new PrismaUserRepository();

        const loginUserUseCase = new LoginUserUseCase(userRepository, securityService);

        const token = await loginUserUseCase.execute({ email, password });

        res.status(200).json({
            accessToken: token,
        });
    } catch (error) {
        next(error);
    }
};