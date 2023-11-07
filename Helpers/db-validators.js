import { request, response } from 'express';
import { Categoria } from '../models/categoria.js';
import { Rol } from '../models/rol.js';
import { Usuario } from '../models/usuario.js';

// ***********  ROLES
export const existeRol = async(rol = '')=>{
    const existeRol = await Rol.findOne({rol})
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta dado de alta en el sistema`)
    } 
}

//*******      USUARIOS */
export const noExisteEmail = async (correo = '') => {
    const existEmail = await Usuario.findOne({correo})
    if(existEmail) {
        throw new Error(`El correo ${correo} ya esta dado de alta en el sistema`)
    }

}
export const existeUsuarioPorId = async (id = '') => {
    const existeUsuario = await Usuario.findById(id)
    if(!existeUsuario) {
        throw new Error(`El usuario ${id} no existe`)
    }

}

//******** CATEGORIAS */

export const existeCategoria = async (req=request, res=response, next)=>{
    const id = req.params.id
    const categoria = await Categoria.findById(id)
    if (!categoria){
        return res.status(404).json({
            msg: 'No existe Categoría'
        })
    }
    next()
}