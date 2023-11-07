import { request, response } from 'express'
import jwt from 'jsonwebtoken'
import { Usuario } from '../models/index.js'

export const validarJWT= async (req=request, res= response, next)=>{
    const token = req.header('x-token')
    if(!token){
        return res.status(404).json({msg:'No hay token en la petición'})
    }
    // * así verificamos un JWT
    try {
        const {uid} = jwt.verify(token, process.env.SECRETPRIVATEKEY)

        const usuario = await Usuario.findById(uid)
        if(!usuario) {
            return res.status(404).json({
                msg: 'Token no autorizado'
            })
        }

        if(!usuario.estado) {
            return res.status(404).json({
                msg: 'Token no autorizado'
            })
        }
        req.usuario = usuario
        next()
    } catch (error) {
        console.log(error);
        res.status(401).json({msg:'Token no válido'})
    }
}