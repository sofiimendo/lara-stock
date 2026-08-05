const { z } = require("zod");

const categorias = [
    "Refrigerados",
    "Endulzantes",
    "Almacén",
    "Harinas y féculas",
    "Frutos secos",
    "Cereales y semillas",
    "Frutas secas",
    "Leudantes y especias",
    "Chocolates y cacao",
    "Saborizantes",
    "Dulces y rellenos",
    "Suplementos",
    "Congelados"
];

const unidades = [
    "kg",
    "litros",
    "unidades"
];

const createItemSchema = z.object({
    nombre: z
        .string({
            error: "El nombre debe ser un texto"
        })
        .trim()
        .min(2, "El nombre debe tener al menos 2 caracteres"),

    categoria: z.enum(categorias, {
        error: "La categoría seleccionada no es válida"
    }),

    cantidad: z
        .number({
            error: "La cantidad debe ser un número"
        })
        .min(0, "La cantidad no puede ser negativa"),

    unidad: z.enum(unidades, {
        error: "La unidad seleccionada no es válida"
    }),

    stockMinimo: z
        .number({
            error: "El stock mínimo debe ser un número"
        })
        .min(1, "El stock mínimo debe ser igual o mayor a 1")
});

const updateItemSchema = createItemSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "Debés enviar al menos un campo para actualizar"
        }
    );

module.exports = {
    createItemSchema,
    updateItemSchema
};