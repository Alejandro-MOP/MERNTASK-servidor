const Proyecto = require('../models/Proyecto');
const { validationResult } =require('express-validator');
const Tarea = require('../models/Tarea');

exports.crearProyecto = async ( req, res ) => {

    //Revisar si hay errores
    const errores = validationResult(req);

        if( !errores.isEmpty() ){
            return res.status(400).json({ errores: errores.array() })
        }

        try {
            // crear un nuevo proyecto
            const proyecto = new Proyecto(req.body);

                //Guardar el creador del proyecto via JWT
                proyecto.creador = req.usuario.id;

                //Guardar el proyecto
                proyecto.save();
                res.json(proyecto);
            
        } catch (error) {

            console.log(error);
            res.status(500).send('Hubo un error');
        }

}

//Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async ( req, res ) => {

    try {//console.log(req.usuario);

        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 }); // WHERE  y ORDER BY en *SQL*
            
            res.json({ proyectos });
        
    } catch (error) {
        
        console.log(error);
        
        res.status(500).send('Hubo un error');
    }
}

//Actualiza el nombre de un proyecto
exports.actualizarProyecto = async ( req, res ) => {
    
    //Revisar si hay errores
    const errores = validationResult(req);

        if( !errores.isEmpty() ){
            return res.status(400).json({ errores: errores.array() })
        }
    
    //extraer la información del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};

        if( nombre ){
            nuevoProyecto.nombre = nombre;
        }

        try {

            //revisar el ID
            let proyecto = await Proyecto.findById(req.params.id); //wHERE *SQL*

                //Si el proyecto existe o no
                if ( !proyecto ){
                    return res.status(404).json({ msg: 'Proyecto no encontrado'});
                }

                //Validar el creador del proyecto
                 if ( proyecto.creador.toString() !== req.usuario.id ){
                     return res.status(401).json({ msg: 'No autorizado' });
                 }

                 //Actualizar
                 proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true }); //UPDATE *SQL*
                 res.json({ proyecto });


            
        } catch (error) {
            
            console.log(error);
            res.status(500).send('Hubo un error en el servidor');
        }
}


//elimina un proyecto por ID
exports.eliminarProyecto = async ( req, res) => {
    
    try {
            //revisar el ID
    let proyecto = await Proyecto.findById(req.params.id);
    

        //Si el proyecto existe o no
        if ( !proyecto ){
            return res.status(404).json({ msg: 'Proyecto no encontrado'});
        }

        //Validar el creador del proyecto
        if ( proyecto.creador.toString() !== req.usuario.id ){
            return res.status(401).json({ msg: 'No autorizado' });
        }

        //Eliminar el proyecto
        await Proyecto.findOneAndRemove({ _id: req.params.id }); //DELETE *SQL*

                
        res.json({ mesg: 'Proyecto eliminado'});

        
    } catch (error) {

        console.log(error);
        res.status(500).send('Hubo un error en el servidor');
    }

}