import { request, response } from 'express'
import { Producto } from '../models/index.js'

//***************** GET's **************************
export const productosGet = async(req = request, res = response) => {
    const {limite = 2, desde = 0} = req.query
    const [productos, total] = await Promise.all([

        Producto.find({estado:true}).limit(limite).skip(Number(desde)).populate('usuario', 'nombre').populate('categoria', 'nombre'),

        Producto.countDocuments({estado:true})
    ])
    res.status(200).json({total, productos})
}

//***************** GET By Id **************************
export const productosGetById = async(req = request, res = response) => {
    const id = req.params.id
    const producto = await Producto.findById(id).populate('usuario','nombre').populate('categoria', 'nombre')
    res.status(200).json({producto})
}

//***************** POST **************************
export const productosPost = async(req = request, res = response) => {
    req.producto = {precio:'0.0'}
    sanitizarProductoNombre(req, res)
    sanitizarProductoPrecio(req,res)
    sanitizarProductoCategoria(req, res)
    sanitizarProductoUsuario(req, res)
    const data = req.producto
    const producto = new Producto(data)
    await producto.save()
    res.status(201).json({msg:'ok', producto})
}

//***************** PUT **************************
export const productosPut = async(req = request, res = response) => {
    const id = req.params.id
    req.producto = {precio:'0.0'}
    await buscarProductoId(req, res)
    sanitizarProductoNombre(req, res)
    sanitizarProductoPrecio(req,res)
    sanitizarProductoCategoria(req, res)
    sanitizarProductoUsuario(req, res)
    const data = req.producto
    const productoDB = await Producto.findByIdAndUpdate(id, data, {new:true})

    res.status(201).json({msg:'ok test', productoDB})

}

//***************** DELETE **************************
export const productosDelete = async(req = request, res = response) => {
    const id = req.params.id
    const productoDB = await Producto.findByIdAndUpdate(id, {estado:false}, {new:true}).populate('categoria', 'nombre').populate('usuario', 'nombre')
    res.status(200).json({msg:'borrado', productoDB})

}

//**************************************************************
//***************** HELPERS Productos **************************
const buscarProductoId = async (req = request, res = response)=>{
    const id = req.params.id
    const productoDB = await Producto.findById(id)
    if (!productoDB){
        return res.status(401).json({msg:`No existe el Producto`})
    }
    if (!productoDB.estado){
        return res.status(401).json({msg:`El Producto fue borrado anteriormente`})
    }

    const {nombre, precio, categoria, usuario} = productoDB
    const producto = {nombre, precio, categoria, usuario}
    
    req.producto = {...producto}
}

// *+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const noExisteNombreProducto = async (nombre)=>{
    const productoDB = await Producto.findOne({nombre})
    if (productoDB) {
        throw new Error(`El nombre '${nombre}' ya existe`)
    }
}

// *+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const sanitizarProductoNombre= (req, res)=>{
    const nombre = req.body.nombre
    if (nombre){
        req.producto = {...req.producto, nombre}
    } 
}

// *+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const sanitizarProductoPrecio = (req, res)=>{
    const {precio: precioReq} = req.producto
    const {precio: precioBody} = req.body
    const precio = !precioBody
    ? precioReq
    : Number(precioBody.replace(/[^0-9.-]+/g,""))
    
    if(isNaN(precio)){
        return res.status(401).json({msg: `No pude procesar precio ${precio}`})
    }
    
    req.producto = {...req.producto, precio}
}

// *+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const sanitizarProductoCategoria = async(req = request, res = response)=>{
    const producto = req.producto
    const categoriaBody = req.body.categoria
    if (categoriaBody && categoriaBody != producto.categoria){
        req.producto = {...req.producto, categoria:categoriaBody}   
    }
}

// *+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const sanitizarProductoUsuario = (req = request, res = response)=>{
    const producto = req.producto
    const {_id: usuarioIdJWT} = req.usuario
    if(producto.usuario !== usuarioIdJWT) {
        req.producto = {...producto, usuario: usuarioIdJWT}
    }
}