// asyncHandler:
// - Recibe una función que atiende una petición (un controlador).
// - Si la función falla, manda el error al siguiente paso para que se muestre bien.
// - Sirve para no repetir manejo de errores en cada controlador.
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;