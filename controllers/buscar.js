import { request, response } from 'express'
import {Types} from 'mongoose'
import { Categoria, Producto, Usuario } from '../models/index.js'

const coleccionesPermitidas = [
    'usuarios', 
    'categoria', 
    'productos', 
    'roles'
]
const buscarUsuarios = async (termino  = '', res = response) => {
    const esMongoId = Types.ObjectId.isValid(termino)
    if (esMongoId){
        const usuario = await Usuario.findById(termino)
        return res.json({ results: (usuario) ? [usuario] : [] })
    }

    const regex = RegExp(termino, 'i')
    console.log(regex);
    const usuarios = await Usuario.find({
        $or: [{nombre : regex}, {correo : regex}],
        $and: [{estado: true}]
    })
    return res.json({results: usuarios})
}

const buscarCategorias = async (termino  = '', res = response) => {
    const esMongoId = Types.ObjectId.isValid(termino)
    if (esMongoId){
        const categoria = await Categoria.findById(termino).populate('usuario','nombre')
        return res.json({ results: (categoria) ? [categoria] : [] })
    }

    const regex = RegExp(termino, 'i')
    console.log(regex);
    const categorias = await Categoria.find({
        nombre : regex, estado: true
    }).populate('usuario','nombre')
    return res.json({results: categorias})
}

const buscarProductos = async (termino  = '', res = response) => {
    const esMongoId = Types.ObjectId.isValid(termino)
    if (esMongoId){
        const producto = await Producto.findById(termino).populate('categoria','nombre').populate('usuario','nombre')
        return res.json({ results: (producto) ? [producto] : [] })
    }

    const regex = RegExp(termino, 'i')
    console.log(regex);
    const productos = await Producto.find({
        nombre : regex, estado: true
    }).populate('categoria','nombre').populate('usuario','nombre')
    return res.json({results: productos})
}

export const buscar = async (req = request, res = response)=> {
    const {coleccion, termino} = req.params
    if (!coleccionesPermitidas.includes(coleccion)){
        return res.status(401).json({msg:`Las colecciones permitidas son ${coleccionesPermitidas}`})
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)

            
            break;
        case 'categoria':
            buscarCategorias(termino, res)
            
            break;
        case 'productos':
            buscarProductos(termino, res)
            break;
    
        default:
            return res.status(500).json({msg:'Se me olvido hacer esta búsqueda'})
            break;
    }




    // return res.json({msg: 'buscar', coleccion, termino})
}