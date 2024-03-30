import { z } from "zod";

export const SIZES = ["S", "M", "L"] as const;
export const COLORS = ["white", "biege", "purple", "blue", "green"] as const;
export const SORT = ["none", "price-asc", "price-desc"] as const;

export const ProductFilterValidator = z.object({
  size: z.array(z.enum(SIZES)),
  color: z.array(z.enum(COLORS)),
  sort: z.enum(SORT),
  price: z.tuple([z.number(), z.number()]),
});

export type ProductState = Omit<
  z.infer<typeof ProductFilterValidator>,
  "price"
> & {
  price: { isCustom: boolean; range: [number, number] };
};
