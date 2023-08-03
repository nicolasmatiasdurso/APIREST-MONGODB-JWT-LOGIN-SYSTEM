const express = require('express');
const router = express.Router();
const {login,register} = require('../controllers/auth.controller.js');
const {body} = require('express-validator');
const {validationResultExpress} = require('../middlewares/validationResultExpress.js');
const validaciontotal = require('../middlewares/validationResultExpress.js');


router.post("/register", [
    body("email","Formato de email erroneo")
    .isEmail()
    .trim()
    .normalizeEmail(),
    body("password","Formato password incorrecto")
    .isLength({min:6})
],
validaciontotal, // Middleware para manejar los resultados de validación
register
);

router.post("/login", [
    body("email","Formato de email erroneo")
    .isEmail()
    .trim()
    .normalizeEmail(),
    body("password","Minimo 6 caracteres")
    .isLength({min:6})
],
validaciontotal,
login);


module.exports = router;
