//Modelo ORM (BD) para proyectos
const mongoose = require('mongoose');

const ProyectoSchema = mongoose.Schema({ 

    nombre:
        {
            type: String,
            required: true,
            trim: true
        },
    
    creador:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario' //nombre del model que obtendremos el id del proyecto
        },
    
    creado:
        {
            type: Date,
            default: Date.now()
        }

});

module.exports = mongoose.model( 'Proyecto', ProyectoSchema );