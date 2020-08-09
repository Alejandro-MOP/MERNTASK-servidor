const Usuario = require('../models/Usuario'); //importa el modelo para crear usuario
const bcryptjs = require('bcryptjs'); //importa el modulo para hashear contraseñas { npm i bcryptjs }
const { validationResult } = require('express-validator'); //funcion que da el resultado de las validaciones del router
const jwt = require('jsonwebtoken'); //importa el json web token {npm i jsonwebtoken}


exports.autenticarUsuario = async ( req, res ) => {
    //revisar si hay errores
    const errores = validationResult(req);

        if( !errores.isEmpty() ){
            return res.status(400).json({ errores: errores.array() })
        }

    const { email, password } = req.body;

        try {
            //validar que sea un usuario registrado
            let usuario = await Usuario.findOne({ email });

                if( !usuario ){
                    return res.status(400).json({ msg: 'El usuario ingresado no existe' });
                }

            //validar el password
            const passCorrecto = await bcryptjs.compare( password, usuario.password);
                
                if( !passCorrecto ){
                    return res.status(400).json({ msg: 'El password es incorrecto' });
                }
            
            //Si todo es correcto: Crear y firmar el JWT
            const payload = {

                usuario: {
                    id: usuario.id
                }

            };
                //firmar el JWT
                jwt.sign(payload, process.env.SECRETA, {

                    expiresIn: 3600  //expira en una hora "se declara en segundos"

                }, (error, token) => {

                    if(error) throw error;

                    //mensaje con el token
                    res.json({ token });

                });

        } catch (error) {

            console.log(error);

        }
}


//Obtiene que usuario esta autenticado
exports.usuarioAutenticado = async ( req, res ) => {
    try {

        const usuario = await Usuario.findById(req.usuario.id).select('-password'); //traer la información del usuario menos el password
            res.json({ usuario });

    } catch (error) {

            console.log(error);
            res.status(500).json({ msg: 'Hubo un error' });

    }
}