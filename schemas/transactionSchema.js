
import { z } from 'zod';

export const transactionValidationSchema = z.object({
    title: z.string()
        .trim()
        .min(1, 'Title is required'),

    amount: z.number()
        .positive('Amount must be greater than 0'),

    type: z.enum(['expense', 'income'], {
        message: 'Type must be either expense or income'
    }),

    category: z.string()
        .trim()
        .min(1, 'Category is required'),

    date: z.coerce.date().optional(),
});
