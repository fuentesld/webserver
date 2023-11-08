import { request, response } from 'express'
import { Categoria, Producto } from '../models/index.js'

export const productosGet = async(req = request, res = response) => {
    const {limite = 2, desde = 0} = req.query
    const [productos, total] = await Promise.all([
        Producto.find({estado:true}).limit(limite).skip(Number(desde)).populate('usuario', 'nombre').populate('categoria', 'nombre'),
        Producto.countDocuments({estado:true})
    ])
    res.status(200).json({total, productos})
}
export const productosGetById = async(req = request, res = response) => {
    const id = req.params.id
    console.log(id);
    const producto = await Producto.findById(id).populate('usuario','nombre').populate('categoria', 'nombre')
    res.status(200).json({producto})
}

export const productosPost = async(req = request, res = response) => {
    // * data
    const currency = req.body.precio
    const nombre = req.body.nombre.toUpperCase()
    const precio = Number(currency.replace(/[^0-9.-]+/g,""));
    const categoria = req.body.categoria

    //* validation
    const categoriaDB = await Categoria.findById(categoria)
    if (!categoriaDB) {
        return res.status(401).json({msg:'La categoría no existe'})
    }
    
    const data = {
        nombre,
        usuario: req.usuario._id,
        precio,
        categoria:categoriaDB._id
    }
    
    const producto = new Producto(data)
    await producto.save()
    res.status(201).json({msg:'ok', producto})
}

export const productosPut = async(req = request, res = response) => {
    
    const id = req.params.id
    const nombreBody = req.body.nombre
    const categoriaBody = req.body.categoria
    const precioBody = req.body.precio

    // * Buscamos producto
    const productoDB = await Producto.findById(id)
    if (!productoDB){
        return res.status(401).json({
            msg:`No existe el Producto`
        })
    }
    if (!productoDB.estado){
        return res.status(401).json({
            msg:`el Producto fue borrado`
        })
    }
    // * Checamos que la categoria exista y no este marcada como borrada
    if (categoriaBody && categoriaBody != productoDB.categoria){
        console.log(categoriaBody);
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
        productoDB.categoria = categoriaDB._id
    
    }

    //* convertimos precio string a numero
    //  dejamos solo 0-9 y .

    const precio = !precioBody
        ? productoDB.precio
        : Number(precioBody.replace(/[^0-9.-]+/g,""))

    if(isNaN(precio)){
        return res.status(401).json({
            msg:`No pude procesar precio ${precio}`
        })
    }

    if (nombreBody){
        productoDB.nombre = nombreBody
    } 

    productoDB.precio = precio
    productoDB.usuario = req.usuario._id

    res.status(201).json({msg:'ok', productoDB})
}

export const productosDelete = async(req = request, res = response) => {
    res.status(200).json({msg:'ok'})
}
