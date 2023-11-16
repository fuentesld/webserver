import { validationResult } from 'express-validator'

export const validarCampos=(req, res, next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json(errors)
    }
    next()

} 

export const coleccionesPermitidas = (coleccion = '', colecciones=[]) =>{
    const incluida = colecciones.includes(coleccion)
    if(!incluida){
        throw new Error(`La colección ${coleccion} no es permitida, utilice ${colecciones}`)
    }
    return true

}