const Usuario = require('../models/Usuario'); //importa el modelo para crear usuario
const bcryptjs = require('bcryptjs'); //importa el modulo para hashear contraseñas { npm i bcryptjs }
const { validationResult } = require('express-validator'); //funcion que da el resultado de las validaciones del router
const jwt = require('jsonwebtoken'); //importa el json web token {npm i jsonwebtoken}


exports.crearUsuario = async (req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);

        if( !errores.isEmpty() ){
            return res.status(400).json({ errores: errores.array() })
        }

    //Destructuring para email y password
    const { email, password } = req.body;
    
        try {
            //validar que el usuario registrado sea unico
            let usuario = await Usuario.findOne({ email });

                if ( usuario ){
                    return res.status(400).json({ msg: 'El usuario ingresado ya existe' })
                }

                //crea el nuevo usuario
                usuario = new Usuario(req.body);

            //hashear password
            const salt = await bcryptjs.genSalt(10);
                usuario.password = await bcryptjs.hash(password, salt);

                //guardar usuario
                await usuario.save();

            //Crear y firmar el JWT
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
            res.status(400).send('Hubo un error con el registro');

        }
}