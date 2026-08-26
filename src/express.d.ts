//declaro (para TypeScript) que el objeto Request tiene una propiedad extra userId
declare namespace Express {
    interface Request {
        userId?: number;
    }
}