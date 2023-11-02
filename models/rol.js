import {Schema, model} from 'mongoose'

export const  RolSchema = Schema({
    rol: {
        type : String,
        required: [true, 'El rol es obligatorio'],
        unique: true,
    },
    

})

export const Rol = model('Roles', RolSchema)