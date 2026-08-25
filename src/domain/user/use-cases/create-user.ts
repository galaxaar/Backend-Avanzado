import { BusinessConflictError } from '../../errors/BusinessConflictError';
import { UserRepository } from '../repositories/UserRepository';
import { SecurityService } from '../services/SecurityService';
import { User } from '../User';

export interface CreateUserUseCaseInput {
    email: string;
    password: string;
}

export class CreateUserUseCase {
    private readonly userRepository: UserRepository;
    private readonly securityService: SecurityService;

    constructor(userRepository: UserRepository, securityService: SecurityService) {
        this.userRepository = userRepository;
        this.securityService = securityService;
    }

    async execute(input: CreateUserUseCaseInput): Promise<User> {
        //existe ya un usuario con ese email?
        const existingUser = await this.userRepository.findByEmail(input.email);
        //si existe, error(Busimess)
        if (existingUser) {
            throw new BusinessConflictError('An user with same email already exists');
        }

        //this. valido email y correo
        this.validatePassword(input.password);

        this.validateEmail(input.email);

        const hashedPassword = await this.securityService.hash(input.password);

        const newUser = await this.userRepository.create({ ...input, password: hashedPassword });

        return newUser;
    }

        //comprueba contraseña segura
    private validatePassword(password: string) {
        const passwordRegExp = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,20}$/);

        if (!passwordRegExp.test(password)) {
            throw new Error('PW_INVALID'); 
        }
    }
     //email válido
    private validateEmail(email: string) {
        const emailRegExp = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

        if (!emailRegExp.test(email)) {
            throw new Error('EMAIL_INVALID'); 
        }
    }
}