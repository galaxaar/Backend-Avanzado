import { z } from 'zod';

//lo traigo a un archivo a parte ya que create-book-controller y edit-book-controller utilizan la misma validacion 
export const bookFieldsSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(200, 'Title must be at most 200 characters'),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(2000, 'Description must be at most 2000 characters'),
    price: z.number().positive('Price must be a positive number'),
    author: z.string().min(2, 'Author must be at least 2 characters').max(200, 'Author must be at most 200 characters'),
});