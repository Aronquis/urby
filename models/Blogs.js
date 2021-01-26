const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const BlogsBlogSchema = mongoose.Schema({
    
    titulo: {
        type: String,
        required: false,
        trim: true
    },
    slug: {
        type: String,
        required: false,
        trim: true
    },
    text: {
        type: String,
        required: false,
        trim: true
    },
    imagen: {
        type: String,
        required: false,
        trim: true
    },
    openGraph: {
        type: String,
        required: false,
        trim: true
    },
    keywords: {
        type: String,
        required: false,
        trim: true,
        default: 1
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    estado: {
        type: Number,
        required: false,
        trim: true
    },
    favorito: {
        type: Number,
        required: false,
        trim: true
    },
    NroComentarios: {
        type: Number,
        required: false,
        trim: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Usuario'
    },
    estadoNotificacion:{
        type: String,
        default: '0',
        required: false,
        trim: true
    },
    categoriaBlog: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'CategoriaBlog'
    },
    comentarios:[
        {
            textComent: {
                type: String,
                required: false,
                trim: true
            },
            stateComent: {
                type: Number,
                required: false,
                trim: true
            },
            blogID: {
                type: String,
                required: false,
                ref: 'Blog'
            },
            userID: {
                type: String,
                required: false,
                ref: 'Usuario'
            },
            creation: {
                type: Date,
                default: Date.now()
            },
            respuestas:[
                {
                    textComent: {
                        type: String,
                        required: false,
                        trim: true
                    },
                    stateComent: {
                        type: Number,
                        required: false,
                        trim: true
                    },
                    comentarioID: {
                        type: String,
                        required: false,
                        rim: true
                    },
                    userID: {
                        type: String,
                        required: false,
                        ref: 'Usuario'
                    },
                    creation: {
                        type: Date,
                        default: Date.now()
                    },
                }
            ]
        }
    ],
    creation: {
        type: Date,
        default: Date.now()
    }
});
BlogsBlogSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Blog', BlogsBlogSchema,"Blogs");