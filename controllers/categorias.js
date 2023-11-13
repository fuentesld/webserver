import { request, response } from 'express'
import { Categoria } from '../models/index.js'

//***************** GET's **************************
export const categoriasGet = async(req = request, res = response) => {
    const {limite = 2, desde = 0} = req.query
    const [categorias, total] = await Promise.all([

        Categoria.find({estado:true}).limit(limite).skip(Number(desde)).populate('usuario', 'nombre'),

        Categoria.countDocuments({estado:true})
    ])
    res.status(200).json({total, categorias})
}

//***************** GET By Id **************************
export const categoriasGetById = async(req = request, res = response) => {
    const id = req.params.id
    const categoria = await Categoria.findById(id).populate('usuario','nombre')
    res.status(200).json({categoria})
}

//***************** POST **************************
export const categoriasPost = async(req = request, res = response) => {
    req.categoria = {}
    sanitizarCategoriaNombre(req, res)
    sanitizarCategoriaUsuario(req, res)
    const data = req.categoria
    const categoria = new Categoria(data)
    await categoria.save()
    res.status(201).json({msg:'ok', categoria})
}

//***************** PUT **************************
export const categoriasPut = async(req = request, res = response) => {
    const id = req.params.id
    req.categoria = {}
    await buscarCategoriaId(req, res)
    sanitizarCategoriaNombre(req, res)
    sanitizarCategoriaUsuario(req, res)
    const data = req.categoria
    const categoriaDB = await Categoria.findByIdAndUpdate(id, data, {new:true})

    res.status(201).json({msg:'ok test', categoriaDB})

}

//***************** DELETE **************************
export const categoriasDelete = async(req = request, res = response) => {
    const id = req.params.id
    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false}, {new:true}).populate('usuario', 'nombre')
    res.status(200).json({msg:'borrado', categoria})

}

//**************************************************************
//***************** HELPERS Categorias **************************
const buscarCategoriaId = async (req = request, res = response)=>{
    const id = req.params.id
    const categoriaDB = await Categoria.findById(id)
    if (!categoriaDB){
        return res.status(401).json({msg:`No existe la Categoría`})
    }
    if (!categoriaDB.estado){
        return res.status(401).json({msg:`La Categoría fue borrado anteriormente`})
    }

    const {nombre, usuario} = categoriaDB
    const categoria = {nombre, usuario}
    
    req.categoria = {...categoria}
}

// *+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const noExisteNombreCategoria = async (nombre)=>{
    const categoriaDB = await Categoria.findOne({nombre})
    if (categoriaDB) {
        throw new Error(`El nombre '${nombre}' ya existe`)
    }
}

// *+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const sanitizarCategoriaNombre= (req, res)=>{
    const nombre = req.body.nombre
    if (nombre){
        req.categoria = {...req.categoria, nombre}
    } 
}


// *+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const sanitizarCategoriaUsuario = (req = request, res = response)=>{
    const categoria = req.categoria
    const {_id: usuarioIdJWT} = req.usuario
    if(categoria.usuario !== usuarioIdJWT) {
        req.categoria = {...categoria, usuario: usuarioIdJWT}
    }
}