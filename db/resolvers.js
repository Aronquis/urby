
const Usuario = require('../models/Usuarios');
const CategoriaBlog = require('../models/CategoriaBlogs');
const Blog = require('../models/Blogs');
const bcryptjs=require('bcryptjs');
const jwt = require('jsonwebtoken');
const lodash = require('lodash');   
const slugConvert = require('slug');


require('dotenv').config({path:'variables.env'});


const createToken = (user, secret) => {
    console.log(user);
    const { id,tipoUsuario,tipoDocumento,nroDocumento,nombres,apellidos,
        fechaNacimiento,email,celular,foto} = user;
    return jwt.sign( { id,tipoUsuario,tipoDocumento,nroDocumento,nombres,apellidos,
        fechaNacimiento,email,celular,foto}, secret )
}
//Resolvers 
const resolvers ={
    Query: {
        getRespuestas: async (_, {numberPages,page,BlogId,comentarioID}) => {
            
            blogs=await Blog.findOne({_id:BlogId});
            comentario = lodash.filter(blogs.comentarios, { "id": comentarioID });
            array_respuestas=lodash.orderBy(comentario[0].respuestas, 'creation','desc');
            
            final_respuestas=lodash.slice(array_respuestas,(page-1)*numberPages, numberPages*page);
            final_respuestas.NroItems=array_respuestas.length;
            final_respuestas.data=final_respuestas
            
            
            final_respuestas.NroItems=final_respuestas.length;
            final_respuestas.data=final_respuestas
            for (let index = 0; index < final_respuestas.data.length; index++) {
                final_respuestas.data[index].Usuarios=await Usuario.findById(final_respuestas.data[index].userID);
            }
            
            return final_respuestas;
        },
        getComentarios: async (_, {numberPages,page,BlogId}) => {
            
            blogs=await Blog.findOne({_id:BlogId});
            
            array_comentarios=lodash.orderBy(blogs.comentarios, 'creation','desc');
            final_comentarios=lodash.slice(array_comentarios,(page-1)*numberPages, numberPages*page);
            final_comentarios.NroItems=final_comentarios.length;
            final_comentarios.data=final_comentarios
    
            for (let index = 0; index < final_comentarios.data.length; index++) {
                final_comentarios.data[index].Usuarios=await Usuario.findById(final_comentarios.data[index].userID);
            }
            return final_comentarios;
        }
    },
    Mutation: {
        CreateRespuestaBlog: async (_, { input } ) => {
            try {
                blogs=await Blog.findOneAndUpdate({_id:input.blogID,"comentarios._id": input.comentarioID}, {$push:{'comentarios.$.respuestas':{'textComent':input.textComent,'stateComent':input.stateComent,'comentarioID':input.comentarioID,"userID":input.userID}, $position: 0}}, { new: true});
                comentario = lodash.filter(blogs.comentarios, { "id": input.comentarioID });
                respuesta=comentario[0].respuestas.pop();
                respuesta.Usuarios=await Usuario.findById(respuesta.userID);
                return respuesta;
                
            } catch(error){
                console.log(error)
            }
        },
        UpdateRespuestaBlog: async (_, { input } ) => {
            try {
                respuesta=await Blog.findOne({_id : input.blogID},function (err, result){
                    result.comentarios.id(input.comentarioID).respuestas.id(input.id).textComent=input.textComent;
                    result.comentarios.id(input.comentarioID).respuestas.id(input.id).stateComent=input.stateComent;
                    result.save();
                    return result;
                });
                coment_respuesta = lodash.filter(respuesta.comentarios,{ "id": input.comentarioID });
                respuesta_final=lodash.filter(coment_respuesta[0].respuestas,{ "id": input.id });
                respuesta_final[0].Usuarios=await Usuario.findById(respuesta_final[0].userID);
                return respuesta_final[0];
            } catch(error){
                console.log(error)
            }
        },
        DeleteRespuestaBlog: async (_, { input } ) => {
            try {
                await Blog.findOne({_id : input.blogID},function (err, result){
                    result.comentarios.id(input.comentarioID).respuestas.id(input.id).remove();
                    result.save();
                });
                return "RESPUESTA_ELIMINADA";
            } catch(error){
                console.log(error)
            }
        },
        CreateComentarioBlog: async (_, { input } ) => {
            try {
                blogs=await Blog.findOneAndUpdate({_id : input.blogID}, {$push:{comentarios:{$each:[{'textComent':input.textComent,'stateComent':input.stateComent,'blogID':input.blogID,"userID":input.userID}]}}}, { new: true});
                comentario=blogs.comentarios.pop();
                comentario.Usuarios=await Usuario.findById(comentario.userID);
                console.log(comentario.userID);
                return comentario;
            } catch(error){
                console.log(error)
            }
        },
        UpdateComentarioBlog: async (_, { input } ) => {
            try {
                const blogs_recup=await Blog.findOne({_id:input.blogID,"comentarios._id":{ $in: [input.id]}});
                comentario_ant = lodash.filter(blogs_recup.comentarios, { "id": input.id });

                const blogs=await Blog.findOneAndUpdate({_id:input.blogID,"comentarios._id":{ $in: [input.id]}}, { "$set": {"comentarios.$":{'_id':input.id,'textComent':input.textComent,'stateComent':input.stateComent,"userID":comentario_ant[0].userID}}}, { new: true});
                comentario = lodash.filter(blogs.comentarios, { "id": input.id });
                comentario[0].Usuarios=await Usuario.findById(comentario[0].userID);
                
                return comentario[0];
            } catch(error){
                console.log(error)
            }
        },
        DeleteComentarioBlog: async (_, { input } ) => {
            try {
                await Blog.findOne({_id : input.blogID,"comentarios._id": input.id },function (err, result) {
                    result.comentarios.id(input.id).remove();       
                    result.save();
                });
    
                return "COMENTARIO_ELIMINADA";
            } catch(error){
                console.log(error)
            }
        },
        CreateBlog: async (_, { input } ) => {
            try {
                input.slug=slugConvert(input.titulo);
                const blogs = new Blog(input);
                const  blogsget = await blogs.save();
                return blogsget;
            } catch(error){
                console.log(error)
            }
        },
        UpdateBlog: async (_, { input } ) => {
            let blogbe = await Blog.findById(input.id);
            if(!blogbe){
                throw new Error('BLOG_NO_EXISTE');
            }
            input.slug=slugConvert(input.titulo);
            blogs = await Blog.findOneAndUpdate({_id : input.id}, input, { new: true});
            
            return blogs;
        },
        DeleteBlog: async (_, { input } ) => {
            let blogbe = await Blog.findById(id);
            if(!blogbe){
                throw new Error('BLOG_NO_EXISTE');
            }

            //Eliminar
            await Blog.findOneAndDelete({_id: id});

            return "ELIMINADO";
        },
        CreateCategoriaBlog: async (_, { input } ) => {
            try {
                input.slug=slugConvert(input.titulo);
                const CategoriaBlogs = new CategoriaBlog(input);
                const  Categorias = await CategoriaBlogs.save();
              
                return Categorias;
            } catch(error){
                console.log(error)
            }
        },
        UpdateCategoriaBlog: async (_, { input } ) => {
            let CategoriaBlogs = await CategoriaBlog.findById(input.id);
            if(!CategoriaBlogs){
                throw new Error('Categoria no encontrado');
            }
            input.slug=slugConvert(input.titulo);
            Categorias = await CategoriaBlog.findOneAndUpdate({_id : input.id}, input, { new: true});
            
            return Categorias;
        },
        DeleteCategoriaBlog: async (_, { input } ) => {
            let Categorias = await CategoriaBlog.findById(id);
            if(!Categorias){
                throw new Error('Producto no encontrada');
            }

            //Eliminar
            await Producto.findOneAndDelete({_id: id});

            return "ELIMINADO";
        },
        Login: async (_, { input } ) => {
            const {email,password} = input;
            //Revisar si el User esta Registrado
            const beUser = await Usuario.findOne({email});
            
            if(!beUser){
                throw new Error('El Usuario no existe');
            }
            //Revisar si el password es correct
            const passwordCorrect = await bcryptjs.compare( password, beUser.password );
            if(!passwordCorrect){
                throw new Error('Contraseña Incorrecta');
            }
            
            return beUser;
            
            
        },
        CreateUsuario: async (_, { input } ) => {
            const {id,tipoUsuario,tipoDocumento,genero,nroDocumento,nombres,apellidos,
                fechaNacimiento,email,password,tipoRedSocial,celular,foto,token} = input;
            //Revisar si el User esta Registrado
            const beUser = await Usuario.findOne({email});

            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);
            input.accesos=[{'tipoRedSocial':input.tipoRedSocial,'password':input.password}];
            if(!beUser){
                //Hashear el Passwor
                try {
                    //Guardar en la DB
                    input.token=createToken(input, process.env.SECRET)
                    const usuario = new Usuario(input);
                    usuario.save();
                    return usuario;
                } catch(error){
                    console.log(error)
                } 
            }
            else{
                switch (input.tipoRedSocial) {
                    case "1":
                        const usuario_recup1 = await Usuario.findOne({_id:beUser.id,"accesos.tipoRedSocial":{ $in: ["1"] }});
                        if(usuario_recup1){
                            throw new Error('EXISTE_TIPO_REGISTRO_1');
                        }
                        else{
                            usuario = await Usuario.findOneAndUpdate({_id : beUser.id}, {$push:{accesos:{$each:[{"tipoRedSocial":"1","password":input.password}]}}}, { new: true});
                            return usuario
                        }
                        break;
                    case "2":
                        
                        const usuario_recup2 = await Usuario.findOne({_id:beUser.id,"accesos.tipoRedSocial":{ $in: ["2"] }});
                        if(usuario_recup2){
                            throw new Error('EXISTE_TIPO_REGISTRO_2');
                        }
                        else{
                            usuario1 = await Usuario.findOneAndUpdate({_id : beUser.id}, {$push:{accesos:{$each:[{"tipoRedSocial":"2","password":input.password}]}}}, { new: true});
                            
                            return usuario1
                        }
                        break;
                    case "3":
                        const usuario_recu3 = await Usuario.findOne({_id:beUser.id,"accesos.tipoRedSocial":{ $in: ["3"] }});
                        if(usuario_recup3){
                            throw new Error('EXISTE_TIPO_REGISTRO_3');
                        }
                        else{
                            usuario = await Usuario.findOneAndUpdate({_id : beUser.id}, {$push:{accesos:{$each:[{"tipoRedSocial":"3","password":input.password}]}}}, { new: true});
                            return usuario
                        }
                        break;
                    case "4":
                        const usuario_recup4 = await Usuario.findOne({_id:beUser.id,"accesos.tipoRedSocial":{ $in: ["4"] }});
                        if(usuario_recup4){
                            throw new Error('EXISTE_TIPO_REGISTRO_4');
                        }
                        else{
                            usuario = await Usuario.findOneAndUpdate({_id : beUser.id}, {$push:{accesos:{$each:[{"tipoRedSocial":"4","password":input.password}]}}}, { new: true});
                            return usuario
                        }
                        break;
                
                    
                }
            }
            
            
        }
    }
}

module.exports = resolvers;