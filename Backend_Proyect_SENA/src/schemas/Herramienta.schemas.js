import { z } from "zod";

export const HerramientaSchemas = z.object({
    nombre: z.string({
        required_error: "El nombre del producto es requeirdo",
    }),
    codigo: z.string({
        required_error: "El codigo del producto es requerido",
    }),
    observaciones: z.string({
        required_error: "La descripcion del producto es requerido",
    }),
    marca: z.string({
        required_error: "La marca del producto es requerido",
    }),
    condicion: z.enum(["BUENO", "REGULAR", "MALO"], {
        required_error: "La condición del producto es requerida",
        invalid_type_error: "La condición debe ser 'BUENO', 'REGULAR' o 'MALO'"
    }),
});
