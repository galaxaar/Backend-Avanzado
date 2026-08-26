import { Router } from 'express';
import { registerUserController } from '../controllers/register-user-controller';
import { loginUserController } from '../controllers/login-user-controller';

export const userRouter = Router();

userRouter.post('/signup', registerUserController);
userRouter.post('/signin', loginUserController);