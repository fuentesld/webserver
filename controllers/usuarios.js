import { request, response } from 'express'
export const usuariosGet = (req=request, res)=> {
    const query = req.query
    res.json({
        msg: 'get API',
        query
    })
}

export const usuariosPut = (req=request, res=response)=> {
    const id = req.params.id
    res.json({
        msg: 'put API',
        id
    })
}

export const usuariosPost = (req, res=response)=> {
    const {nombre, edad} = req.body 
    res.json({
        msg: 'post API',
        nombre,
        edad
    })
}

export const usuariosDelete = (req, res=response)=> {
    res.json({
        msg: 'delete API'
    })
}