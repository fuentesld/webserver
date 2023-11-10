import { request, response } from 'express';
import { Categoria } from '../models/categoria.js';
import { Rol } from '../models/rol.js';
import { Usuario } from '../models/usuario.js';
import { Producto } from '../models/producto.js';

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

export const existeCategoriaPorId = async (id='')=>{
    const existeCategoria = await Categoria.findById(id)
    if(!existeCategoria || !existeCategoria.estado) {
        throw new Error(`La Categoria ${id} no existe`)
    }
} 

//******** Productos */

export const existeProductoPorId = async (id='')=>{
    const existeProducto = await Producto.findById(id)
    if(!existeProducto || !existeProducto.estado) {
        throw new Error(`El Producto ${id} no existe`)
    }
} 