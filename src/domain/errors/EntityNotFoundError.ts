import { DomainError } from './DomainError';

//EntityNotFoundError para cuando buscamos algo por ID y no existe
export class EntityNotFoundError extends DomainError {
    readonly name = 'EntityNotFoundError';

    constructor(entity: string, id: string) {
        super(`entity ${entity} not found with id ${id}`);
    }
}