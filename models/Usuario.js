//Modelo ORM (BD) para usuarios
const mongoose = require('mongoose');

const UsuariosSchema = mongoose.Schema({
    //campos y atributos de cada campo para la BD
    nombre: 
        {
            type: String,
            required: true,
            trim: true,
        },

    email: 
        {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

    password:
        {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

    registro:
        {
            type: Date,
            default: Date.now()
        }

});

module.exports = mongoose.model('Usuario', UsuariosSchema);