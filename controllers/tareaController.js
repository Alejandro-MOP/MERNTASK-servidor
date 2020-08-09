const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

//Crea una nueva tarea
exports.crearTarea = async ( req, res ) => {

    //Revisar si hay errores
    const errores = validationResult(req);

        if( !errores.isEmpty() ){
            return res.status(400).json({ errores: errores.array() })
        }
        
        
        try {
            
            //Extraer el proyecto y commprobar si existe
            const { proyecto } = req.body;

            const  existeProyecto = await Proyecto.findById(proyecto);
                
                if(!existeProyecto){
                    return res.status(404).json({ msg: 'Proyecto no encontrado' });
                }

                //Validar el creador del proyecto
                if ( existeProyecto.creador.toString() !== req.usuario.id ){
                    return res.status(401).json({ msg: 'No autorizado' });
                }

            //Crear la tarea
            const tarea = new Tarea(req.body);

                await tarea.save();
                res.json({ tarea });

        } catch (error) {

            console.log(error);
            res.status(500).send('Hubo un error');
        }
};


//Obtener las tareas por proyecto

exports.obtenerTareas = async ( req, res) => {

    
    try {

        //Extraer el proyecto y commprobar si existe
        const { proyecto } = req.query; //al modificar el frontend "tareaState" "obtenerTareas()" al usar params no se usa req.body -> req.query
    
        const  existeProyecto = await Proyecto.findById(proyecto);
            
            if(!existeProyecto){
                return res.status(404).json({ msg: 'Proyecto no encontrado' });
            }
    
            //Validar el creador del proyecto
            if ( existeProyecto.creador.toString() !== req.usuario.id ){
                return res.status(401).json({ msg: 'No autorizado' });
            }

        //Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 }); //WHERE  *SQL*
            res.json({ tareas });
        
        } catch (error) {

            console.log(error);
            res.status(500).send('Hubo un error');
        }
};

//Actualizar una tarea
exports.actualizarTarea = async ( req, res ) => {

    try {

        //Extraer el proyecto y commprobar si existe
        const { proyecto, nombre, estado } = req.body;
    
        //Validar tarea existente
        let tarea = await Tarea.findById(req.params.id);

            if(!tarea){
                return res.status(404).json({ msg: 'No existe esa tarea' });
            }
        
        //Extraer proyecto
        const  existeProyecto = await Proyecto.findById(proyecto);

            //Validar el creador del proyecto
            if ( existeProyecto.creador.toString() !== req.usuario.id ){
                return res.status(401).json({ msg: 'No autorizado' });
            }

        //Crear un objeto con nueva información
        const nuevaTarea = {};
            
            nuevaTarea.nombre = nombre;

            nuevaTarea.estado = estado;
        
        //Guardar la tarea
        tarea = await Tarea.findByIdAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true }); //UPDATE *SQL*
            res.json({ tarea });
        
    } catch (error) {

        console.log(error);
        res.status(500).send('Hubo un error');
    }
};


//Eliminar una tarea
exports.eliminarTarea = async ( req, res) => {

    try {

        //Extraer el proyecto y commprobar si existe
        const { proyecto } = req.query;
    
        //Validar tarea existente
        let tarea = await Tarea.findById(req.params.id);

            if(!tarea){
                return res.status(404).json({ msg: 'No existe esa tarea' });
            }
        
        //Extraer proyecto
        const  existeProyecto = await Proyecto.findById(proyecto);

            //Validar el creador del proyecto
            if ( existeProyecto.creador.toString() !== req.usuario.id ){
                return res.status(401).json({ msg: 'No autorizado' });
            }

            //Eliminar tarea
            await Tarea.findOneAndRemove({ _id: req.params.id }); //DELETE *SQL*
            res.json({ msg: 'Tarea Eliminada' });
    } catch (error) {

        console.log(error);
        res.status(500).send('Hubo un error');
    }

};