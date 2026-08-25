import { DomainError } from './DomainError';

//Cuando un usuario no tiene accesos para por ejemplo borrar un libro de alguien más
export class ForbiddenOperationError extends DomainError {
    readonly name = 'ForbiddenOperationError';

    constructor(message: string) {
        super(message);
    }
}