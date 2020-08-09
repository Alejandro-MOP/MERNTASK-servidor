const express = require('express');
// rutas para autenticar usuarios
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator'); // { npm i express-validator }
const auth = require('../middleware/auth');

//Iniciar Sesión /autenticar usuario
//api/auth
router.post('/',
    authController.autenticarUsuario
);

//Obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);


module.exports =  router;