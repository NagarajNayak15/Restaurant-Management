import z from "zod"

const menuSchema = z.object({
  name: z.string().min(2),

  category: z.string(),
  
  non_veg: z.boolean(),

  description: z.string().optional(),

  price: z.number().positive(),

  imageUrl: z.string().optional(),

  isAvailable: z.boolean().optional(),

  prepTimeMinutes: z.number().optional(),
});

export default menuSchema;