const mongoose = require('mongoose');

const UsuariosSchema = mongoose.Schema({
    
    tipoUsuario: {
        type: String,
        required: false,
        trim: true
    },
    tipoDocumento: {
        type: String,
        required: false,
        trim: true
    },
    nroDocumento: {
        type: String,
        required: false,
        trim: true
    },
    nombres: {
        type: String,
        required: false,
        trim: true
    },
    apellidos: {
        type: String,
        required: false,
        trim: true
    },
    fechaNacimiento: {
        type: String,
        required: false,
        trim: true
    },
    email : {
        type: String,
        required: false,
        trim: true
    },
    celular : {
        type: String,
        required: false,
        trim: true
    },
    foto :{
        type: String,
        required: false,
        trim: true
    },
    genero: {
        type: String,
        required: false,
        trim: true
    },
    token: {
        type: String,
        required: false,
        trim: true
    },
    accesos: [
        {
            tipoRedSocial: {
                type: String,
                required: false,
                trim: true
            },
            password: {
                type: String,
                required: false,
                trim: true
            }
        }
    ],
    creation: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Usuario', UsuariosSchema,"Usuarios");