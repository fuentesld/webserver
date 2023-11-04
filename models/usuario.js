import {Schema, model} from 'mongoose'

export const  UsuarioSchema = Schema({
    nombre: {
        type : String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type : String,
        required: [true, 'El correo es obligatorio'],
        unique: true,
    },
    password : {
        type : String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img : {
        type : String,
    },
    rol:{
        type: String,
        required : true,
        enum : ['ADMIN_ROL', 'USER_ROL', 'VENTAS_ROL']
    },
    estado : {
        type : Boolean,
        default : true,
    },
    google : {
        type : Boolean,
        default : false,
    },

})

UsuarioSchema.methods.toJSON = function() {
    const {__v, password, _id, ...usuario} = this.toObject()
    const usuarioModificado = {...usuario, uid: _id}
    return usuarioModificado
}

export const Usuario = model('Usuario', UsuarioSchema)