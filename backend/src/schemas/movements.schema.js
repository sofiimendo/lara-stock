const { z } = require("zod");

const movementSchema = z.object({
  itemId: z
    .string()
    .min(1, "El ID del insumo es obligatorio"),

  tipo: z.enum(["entrada", "salida"], {
    message: "El tipo debe ser entrada o salida",
  }),

  cantidad: z
    .number({
      message: "La cantidad debe ser un número",
    })
    .positive("La cantidad debe ser mayor a 0"),

  motivo: z
    .string()
    .trim()
    .min(2, "El motivo debe tener al menos 2 caracteres")
    .optional(),
});

module.exports = {
  movementSchema,
};