const express = require('express');
// rutas para crear usuarios
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator'); // { npm i express-validator }


//Crea un usuario
//api/usuarios
router.post('/',
    [   //validaciones que se realizaran en el modulo; el resultado debe codearse en el controlador
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 })
    ],
    usuarioController.crearUsuario
);
module.exports =  router;
