const { gql } = require('apollo-server');

//Schema
const typeDefs = gql`

    type Usuario {
        id: ID
        tipoUsuario:Int
        tipoDocumento:Int
        nroDocumento:String
        nombres: String
        apellidos: String
        fechaNacimiento:String
        genero:String
        email:String
        celular:String
        tipoRedSocial:String
        password:String
        foto:String
        token:String
        creation: String
    }
    input UsuarioInput {
        id: ID
        tipoUsuario:Int
        tipoDocumento:Int
        nroDocumento:String
        nombres: String
        apellidos: String
        fechaNacimiento:String
        genero:String
        email:String
        celular:String
        tipoRedSocial:String
        password:String
        foto:String
        token:String
    }
    input loginInput{
        email:String
        nroCelular:String
        codigoSeguridad:String
        password:String
    }
    type CategoriaBlog {
        id:String
        titulo:String
        slug:String
        keywords:String
        descripcion:String
        imagen:String
        openGraph:String
        estado:Int
        creation:String
    }
    input CategoriaBlogInput {
        id:String
        titulo:String
        slug:String
        keywords:String
        descripcion:String
        imagen:String
        openGraph:String
        estado:Int
    }
    type Blog {
        id:String
        titulo:String
        slug:String
        text:String
        imagen:String
        openGraph:String
        keywords:String
        description:String
        estado:Int
        favorito:Int
        nroComentarios:Int
        usuario:String
        categoriaBlog:String
        Usuario:Usuario
        CategoriaBlog:CategoriaBlog
        creation:String
    }
    input BlogInput {
        id:String
        titulo:String
        slug:String
        text:String
        imagen:String
        openGraph:String
        keywords:String
        description:String
        estado:Int
        favorito:Int
        usuario:String
        categoriaBlog:String
        creation:String
    }
    type ComentariosBlog{
        id:ID
        textComent:String
        stateComent:Int
        blogID:String
        userID:String
        creation:String
        Usuarios:Usuario
    }
    input ComentariosBlogInput{
        id:ID
        textComent:String
        stateComent:Int
        blogID:String
        userID:String
    }
    type RespuestasBlog{
        id:ID
        textComent:String
        stateComent:Int
        comentarioID:String
        userId:String
        creation:String
        Usuarios:Usuario
    }
    input RespuestasBlogInput{
        id:ID
        textComent:String
        stateComent:Int
        comentarioID:String
        userID:String
        blogID:String
    }
    type GetComentarios {
        NroItems:Int
        data:[ComentariosBlog!]
    }
    type GetRespuestas {
        NroItems:Int
        data:[RespuestasBlog!]
    }
    type Query {
        getComentarios(BlogId:String,numberPages:Int,page:Int): GetComentarios
        getRespuestas(comentarioID:String,BlogId:String,numberPages:Int,page:Int): GetRespuestas
    }
    type Mutation {
        #crear rspuestas
        CreateRespuestaBlog(input: RespuestasBlogInput) : RespuestasBlog
        UpdateRespuestaBlog(input: RespuestasBlogInput) : RespuestasBlog
        DeleteRespuestaBlog(input: RespuestasBlogInput) : String
        #crear comentario blog
        CreateComentarioBlog(input: ComentariosBlogInput) : ComentariosBlog
        UpdateComentarioBlog(input: ComentariosBlogInput) : ComentariosBlog
        DeleteComentarioBlog(input: ComentariosBlogInput) : String

        CreateBlog(input: BlogInput) : Blog
        UpdateBlog(input: BlogInput) : Blog
        DeleteBlog(input: BlogInput) : String

        CreateCategoriaBlog(input: CategoriaBlogInput) : CategoriaBlog
        UpdateCategoriaBlog(input: CategoriaBlogInput) : CategoriaBlog
        DeleteCategoriaBlog(input: CategoriaBlogInput) : String
        #Usuarios
        CreateUsuario(input: UsuarioInput) : Usuario
        Login(input: loginInput) : Usuario
        
    }
`;

module.exports = typeDefs;