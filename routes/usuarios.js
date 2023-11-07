import { Router } from 'express';
import {check, query} from 'express-validator'

import { noExisteEmail, existeRol, existeUsuarioPorId } from '../Helpers/db-validators.js';
import {usuariosDelete, 
    usuariosGet, 
    usuariosPost, 
    usuariosPut } from '../controllers/usuarios.js';
// import { validarJWT } from '../middlewares/validar-jwt.js';
// import { esAdminRol, tieneRol } from '../middlewares/validar-roles.js';
// import { validarCampos } from '../middlewares/validar-campos.js';
import { esAdminRol, tieneRol, validarJWT,validarCampos} from '../middlewares/index.js'

export const usuariosRouter = Router()

usuariosRouter.get('/', 
    [
        query('limite', 'límite negativo').optional().isInt({min:1}),
        query('desde', 'valor inválido').optional().isInt({min:0}),
        validarCampos,],
    usuariosGet
)

usuariosRouter.post('/', [
        check('nombre', 'El nombre esta vacío').not().isEmpty(),
        check('password', 'El password debe de tener mas de seis letras').isLength({ min:6 }),
        check('correo').custom(noExisteEmail),
        check('rol').custom(existeRol),
        validarCampos,
        // check('correo', 'El correo no es válido').isEmail(),
        // check('rol', 'El rol no es válido').isIn(['ADMIN_ROL', 'USER_ROL']),
    ], 
    usuariosPost)

usuariosRouter.put('/:id',
    [
        check('id', `ID inválido`).isMongoId(),
        check('id').custom(existeUsuarioPorId),
        check('rol').custom(existeRol),
        validarCampos
    ] ,
    usuariosPut
)

usuariosRouter.delete('/:id',
    validarJWT,
    // esAdminRol,
    tieneRol('VENTAS_ROL','ADMIN_ROL'),
    [
        check('id', `ID inválido`).isMongoId(),
        check('id').custom(existeUsuarioPorId),
        validarCampos
    ],
    usuariosDelete
)


