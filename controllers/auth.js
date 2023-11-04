import { request, response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import {Usuario} from '../models/usuario.js'
import { generarjwt } from '../Helpers/generar-jwt.js'

export const authGet = async(req=request, res=response)=> {
    res.json({msg:'get API/auth'})
}

export const authPost = async (req=request, res=response)=> {

    const {correo, password} = req.body 
    try {
        const usuario = await Usuario.findOne({ correo })
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password incorrectos- correo',
            })
        }
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password incorrectos- status',
            })
        }

        const passwordValido = bcrypt.compareSync(password, usuario.password)

        if(!passwordValido) {
            return res.status(400).json({
                msg: 'Usuario / Password incorrectos- password',
            })
        }

        const token = await generarjwt(usuario.id)

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Db Error'})
    }
    // // Encriptamos password
    // const salt = bcrypt.genSaltSync(10)
    // usuario.password = bcrypt.hashSync(password, salt)

    // await usuario.save()
    
}

// export const usuariosPut = async (req=request, res=response)=> {
//     const id = req.params.id
//     const {_id, password, google, correo, ...resto} = req.body

//     if (password) {
//         // Encriptamos password
//         const salt = bcrypt.genSaltSync(10)
//         resto.password = bcrypt.hashSync(password, salt)
//     }
//     console.log(resto);

//     // const usuario = new Usuario()
//     const usuario = await Usuario.findByIdAndUpdate(id, resto)

//     res.json({usuario})
// }

// export const usuariosDelete = async(req, res=response)=> {
//     const {id} = req.params
//     const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})
//     res.json({
//         usuario
//     })
// }