// Base para todos nuestros errores

export abstract class DomainError extends Error {
    abstract readonly name: string;
}