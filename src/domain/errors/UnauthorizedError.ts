import { DomainError } from './DomainError';

//cuando no hay token o es inválido
export class UnauthorizedError extends DomainError {
    readonly name = 'UnauthorizedError';

    constructor(message: string) {
        super(message);
    }
}