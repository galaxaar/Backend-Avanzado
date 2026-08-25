import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { UserRepository } from '../repositories/UserRepository';
import { SecurityService } from '../services/SecurityService';

interface LoginUserUseCaseInput {
    email: string;
    password: string;
}

export class LoginUserUseCase {
    constructor( //con TypeScript creamos la propiedad y la asigno anutomaticamente
        private readonly userRepository: UserRepository,
        private readonly securityService: SecurityService,
    ) { }

    async execute(input: LoginUserUseCaseInput) {
        const user = await this.userRepository.findByEmail(input.email);

         // si no existe X usario lanzamos el UnauthorizedError para evitar user enumeration
        if (!user) {
            throw new UnauthorizedError('Invalid email or password');
        }

        const isMatch = await this.securityService.comparePasswords(input.password, user.password);
        //si no hay match entre email y contraseña. El usuario existe pero la contraseña no coincide
        if (!isMatch) {
            throw new UnauthorizedError('Invalid email or password');
        }

        //si todo es correcto generamos y devolvemos el tken
        const token = this.securityService.generateJwt(user.id);

        return token;
    }
}