import { request, response } from 'express';

// * Llamar este middleware después de validarJWT!!!
export const esAdminRol = (req = request, res = response,next)=> {
    if (!req.usuario){
        return res.status(500).json({
            msg:'no rol, token no verificado'
        })
    }
    const {rol, nombre} = req.usuario

    if (rol != 'ADMIN_ROL'){
        return res.status(401).json({
            msg:`${nombre} no es administrador`
        })
    }

    next()
} 

export const tieneRol = ( ...roles )=>{

    return (req=request, res=response, next) => {

        if (!req.usuario){
            return res.status(500).json({
                msg:'no rol, token no verificado'
            })
        }

        if (! roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg:'El rol no esta autorizado'
            })
        }
        next()
    }

}
