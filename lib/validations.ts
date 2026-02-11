import { z } from 'zod';

export const patientSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Age must be a positive number.",
    }),
    gender: z.enum(['Male', 'Female', 'Other']),
    contact: z.string().min(10, { message: "Contact number must be at least 10 digits." }),
    address: z.string().min(5, { message: "Address must be at least 5 characters." }),
});

export type PatientFormValues = z.infer<typeof patientSchema>;


export const visitSchema = z.object({
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    diagnosis: z.string().min(2, { message: "Diagnosis must be at least 2 characters." }),
    medication: z.string().optional(),
    notes: z.string().optional(),
});

export type VisitFormValues = z.infer<typeof visitSchema>;
