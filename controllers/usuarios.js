import { request, response } from 'express'
import bcrypt from 'bcryptjs'

import {Usuario} from '../models/usuario.js'

export const usuariosGet = async(req=request, res)=> {
     let {limite=2, desde = 0} = req.query
     if (isNaN(limite)) limite = 2
     if (isNaN(desde)) desde = 0


    // const usuarios = await Usuario.find({estado:true}).limit(limite).skip(Number(desde))
    // const total = await Usuario.countDocuments({estado:true})

    const [usuarios, total] = await Promise.all([
        Usuario.find({estado:true}).limit(limite).skip(Number(desde)),
        Usuario.countDocuments({estado:true})
    ]
    )
    res.json({total, usuarios})
}

export const usuariosPost = async (req, res=response)=> {

    const {nombre, correo, password, rol} = req.body 

    const usuario = new Usuario({nombre, correo, password, rol})

    // Encriptamos password
    const salt = bcrypt.genSaltSync(10)
    usuario.password = bcrypt.hashSync(password, salt)

    await usuario.save()
    res.json({
        msg: 'post API',
        usuario,
    })
}

export const usuariosPut = async (req=request, res=response)=> {
    const id = req.params.id
    const {_id, password, google, correo, ...resto} = req.body

    if (password) {
        // Encriptamos password
        const salt = bcrypt.genSaltSync(10)
        resto.password = bcrypt.hashSync(password, salt)
    }
    console.log(resto);

    // const usuario = new Usuario()
    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json({usuario})
}

export const usuariosDelete = async(req, res=response)=> {
    const {id} = req.params
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})
    res.json({
        usuario
    })
}