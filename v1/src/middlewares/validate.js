const httpStatus = require("http-status");

// Return olmadan (Implicit Return):
// Her iki örnekte de sonuç aynı olacaktır. JavaScript'te, bir fonksiyon bir değer döndürüyorsa ve bu değer bir fonksiyon ise, bu durumda return ifadesi kullanmak isteğe bağlıdır (implicit return). Arrow fonksiyonları genellikle kısa ifadeler içindir, bu nedenle implicit return kullanımı oldukça yaygındır.

const validate = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body);

  if (error) {
    // error.details = [{message:""},{message:""}]
    const errorMessage = error.details
      ?.map((detail) => detail.message)
      .join(", ");
    // ["","",""] => "aaa, bbb, ccc"
    return res.status(httpStatus.BAD_REQUEST).json({ error: errorMessage });
  }
  Object.assign(req, value);
  return next();
};


// const validate = (schema) => {
//   return (req, res, next) => {
//     const { value, error } = schema.validate(req.body);

//     if (error) {
//       const errorMessage = error.details
//         ?.map((detail) => detail.message)
//         .join(", ");
//       return res.status(httpStatus.BAD_REQUEST).json({ error: errorMessage });
//     }
//     Object.assign(req, value);
//     return next();
//   };
// };


module.exports = validate;
