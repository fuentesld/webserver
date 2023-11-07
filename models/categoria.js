import {Schema, model} from 'mongoose'

export const  CategoriaSchema = Schema({
    nombre: {
        type : String,
        required: [true, 'El nombre es obligatorio']
    }, 
    estado : {
        type : Boolean,
        default : true,
    },
    usuario : {
        type : Schema.Types.ObjectId,
        ref : 'Usuario',
        required: true,
    }


})

CategoriaSchema.methods.toJSON = function() {
    const {__v, _id, estado, ...data} = this.toObject()
    const categoriaModificado = {...data, uid: _id}
    return categoriaModificado
}

export const Categoria = model('Categoria', CategoriaSchema)