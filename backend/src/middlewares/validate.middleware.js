const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                campo: issue.path.join("."),
                mensaje: issue.message
            }));

            return res.status(400).json({
                mensaje: "Datos inválidos",
                errores: errors
            });
        }

        req.body = result.data;

        next();
    };
};

module.exports = validate;