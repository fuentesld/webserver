import { request, response } from 'express'
import { Categoria, Usuario } from '../models/index.js'

export const categoriasGet = async (req = request, res = response) => {
    const {limite = 2, desde = 0} = req.query
    // const usuarios = await Usuario.find({estado:true}).limit(limite).skip(Number(desde))
    // const total = await Usuario.countDocuments({estado:true})
    const [categorias, total] = await Promise.all([
        Categoria.find({estado:true}).limit(limite).skip(Number(desde)).populate('usuario', 'nombre'),
        Categoria.countDocuments({estado:true})
    ])
    res.status(200).json({total, categorias})
}

export const categoriasGetById = async (req = request, res = response) => {
    const id = req.params.id
    const categoria = await Categoria.findById(id).populate('usuario','nombre')
    res.status(200).json({categoria})
}

export const categoriasPost = async(req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase()
    const categoriaDB = await Categoria.findOne({nombre})
    if (categoriaDB) {
        return res.status(401).json({msg:'La categoría ya existe'})
    }
    
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    
    const categoria = new Categoria(data)
    await categoria.save()
    res.status(201).json({msg:'ok', categoria})
}

export const categoriasPut = async(req = request, res = response) => {
    const id = req.params.id
    const {nombre} = req.body
    const idUsuario = req.usuario._id
    const categoria = await Categoria.findById(id)
    categoria.nombre = nombre
    categoria.usuario = idUsuario
    await categoria.save()
    res.status(201).json({msg:'ok', categoria})
}

export const categoriasDelete = async(req = request, res = response) => {
    const id = req.params.id
    const categoria = await Categoria.findById(id)
    categoria.estado=false
    await categoria.save()
    
    res.status(201).json({msg:'ok', categoria})
}