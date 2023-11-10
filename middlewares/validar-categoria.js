import { Categoria, Producto } from '../models/index.js'

export const sanitizaProducto = async(req = request, res = response, next)=> {

    next()
} 

export const sanitizaIdProducto = async(req = request, res = response, next)=> {
    // const id = req.params.id

    // // * Buscamos producto
    // const productoDB = await Producto.findById(id)
    // if (!productoDB){
    //     return res.status(401).json({
    //         msg:`No existe el Producto`
    //     })
    // }
    // if (!productoDB.estado){
    //     return res.status(401).json({
    //         msg:`el Producto fue borrado`
    //     })
    // }

    // req.producto = {id}

    next()
} 

export const sanitizaNombreProducto = async(req = request, res = response, next)=>{

    next()
}