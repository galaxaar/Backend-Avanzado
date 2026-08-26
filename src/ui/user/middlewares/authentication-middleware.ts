import { Request, Response, NextFunction } from 'express';
import { SecurityServiceImplementation } from '../../../infrastructure/user/services/SecurityServiceImplementation';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';

// aqui extraemos el token, lo verificamos y si es valido se guarda
export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        throw new UnauthorizedError('Token not in request');
    }

    const sanitizedToken = token.replace('Bearer ', '');

    const securityService = new SecurityServiceImplementation();

    const decodedToken = securityService.verifyJwt(sanitizedToken);
    req.userId = decodedToken?.userId;

    if (decodedToken) {
        next();
    } else {
        throw new UnauthorizedError('Token not valid');
    }
};