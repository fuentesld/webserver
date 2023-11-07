import {Schema, model} from 'mongoose'

export const  ProductoSchema = Schema({
    nombre: {
        type : String,
        required: [true, 'El nombre es obligatorio']
    }, 
    precio : {
        type: Number,
        default: 0
    },
    estado : {
        type : Boolean,
        default : true,
    },
    usuario : {
        type : Schema.Types.ObjectId,
        ref : 'Usuario',
        required: true,
    },
    categoria : {
        type : Schema.Types.ObjectId,
        ref : 'Categoria',
        required: true,
    },


})

ProductoSchema.methods.toJSON = function() {
    const {__v, _id, estado, ...data} = this.toObject()
    const categoriaModificado = {...data, uid: _id}
    return categoriaModificado
}

export const Producto = model('Producto', ProductoSchema)