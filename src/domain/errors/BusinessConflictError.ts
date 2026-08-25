import { DomainError } from './DomainError';

//BusinessConflictError cuando por ejemplo ya existe un email (no podemos registrarlo 2 veces)
export class BusinessConflictError extends DomainError {
    readonly name = 'BusinessConflictError';

    constructor(message: string) {
        super(message);
    }
}