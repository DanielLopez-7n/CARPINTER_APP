// asyncHandler:
// - Recibe una función que atiende una petición (un controlador).
// - Si la función falla, manda el error al siguiente paso para que se muestre bien.
// - Sirve para no repetir manejo de errores en cada controlador.
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};