const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const CategoriasBlogSchema = mongoose.Schema({
    
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
    keywords: {
        type: String,
        required: false,
        trim: true
    },
    descripcion: {
        type: String,
        required: false,
        trim: true
    },
    imagen: {
        type: String,
        required: false,
        trim: true,
        default: 1
    },
    openGraph: {
        type: String,
        required: false,
        trim: true
    },
    estado: {
        type: Number,
        required: false,
        trim: true
    },
    creation: {
        type: Date,
        default: Date.now()
    }
});
CategoriasBlogSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('CategoriaBlog', CategoriasBlogSchema,"CategoriaBlogs");