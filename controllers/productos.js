import { request, response } from 'express'
import { Categoria, Producto } from '../models/index.js'

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
    console.log(id);
    const producto = await Producto.findById(id).populate('usuario','nombre').populate('categoria', 'nombre')
    res.status(200).json({producto})
}

//***************** POST **************************
export const productosPost = async(req = request, res = response) => {
    const productoReq = req.producto
    const producto = new Producto(productoReq)
    await producto.save()
    res.status(201).json({msg:'ok', producto})
}

//***************** PUT **************************
export const productosPut = async(req = request, res = response) => {
    try {
        const producto = req.producto
        const id = req.params.id
        const productoDB = await Producto.findByIdAndUpdate(id, producto, {new:true})
    
        res.status(201).json({msg:'ok test', productoDB})
        
    } catch (error) {
        console.log(error);
    }
}

//***************** DELETE **************************
export const productosDelete = async(req = request, res = response) => {
    try {
        const id = req.params.id
        const productoDB = await Producto.findByIdAndUpdate(id, {estado:false}, {new:true}).populate('categoria', 'nombre').populate('usuario', 'nombre')
        res.status(200).json({msg:'borrado', productoDB})
        
    } catch (error) {
        console.log(error);
    }
}



//***************** HELPERS Productos **************************
export const InicializaProducto = (req = request, res = response, next)=> {
    req.producto = {}
    next()
}

export const BuscaNombreProducto = async (req = request, res = response, next)=>{
    const nombre = req.body.nombre
    const productoDB = await Producto.findOne({nombre})
    if (productoDB) {
        return res.status(401).json({msg:'El nombre del producto ya existe'})
    }
    next()
}

export const noExisteNombreProducto = async (nombre)=>{
    const productoDB = await Producto.findOne({nombre})
    if (productoDB) {
        throw new Error(`El nombre '${nombre}' ya existe`)
    }
}


export const buscaProductoId = async (req = request, res = response, next)=>{
    const id = req.params.id
    const productoDB = await Producto.findById(id)
    if (!productoDB){
        return res.status(401).json({
            msg:`No existe el Producto`
        })
    }
    if (!productoDB.estado){
        return res.status(401).json({
            msg:`El Producto fue borrado anteriormente`
        })
    }

    const {nombre, precio, categoria, usuario} = productoDB
    const producto = {
        nombre,
        precio,
        categoria,
        usuario
    }
    
    req.producto = producto
    next()

}

export const actualizarProductoNombre = (req = request, res = response, next)=>{
    const nombre = req.body.nombre
    if (nombre){
        req.producto = {...req.producto, nombre}
    } 
    next()
}

export const actualizarProductoPrecio = (req = request, res = response, next)=>{
    const producto = req.producto
    const precioBody = req.body.precio || '0.0'

    const precio = !precioBody
        ? producto.precio
        : Number(precioBody.replace(/[^0-9.-]+/g,""))

    if(isNaN(precio)){
        return res.status(401).json({
            msg:`No pude procesar precio ${precio}`
        })
    }

    req.producto = {...req.producto, precio}
    next()
}

export const actualizarProductoCategoria = async(req = request, res = response, next)=>{
    const producto = req.producto
    const categoriaBody = req.body.categoria
    if (categoriaBody && categoriaBody != producto.categoria){
        const categoriaDB = await Categoria.findById(categoriaBody)

        if(!categoriaDB){
            return res.status(401).json({
                msg:`No existe la Categoria`
            })
        }

        if (!categoriaDB.estado){
            return res.status(401).json({
                msg:`La Categoria fue borrada`
            })
        }

        const categoria = categoriaDB._id
        req.producto = {...req.producto, categoria}
        
    }
    next()
}

export const actualizarProductoUsuario = (req = request, res = response, next)=>{
    const producto = req.producto
    const usuarioJWT = req.usuario
    const productoIdUsuario = producto.usuario
    const usuarioIdJWT = usuarioJWT._id

    if(productoIdUsuario !== usuarioIdJWT) {
        const usuario = usuarioIdJWT
        req.producto = {...producto, usuario}
    }

    next()
}
