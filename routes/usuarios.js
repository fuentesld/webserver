import { Router } from 'express';
import {check} from 'express-validator'

import { noExisteEmail, existeRol, existeUsuarioPorId } from '../Helpers/db-validators.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import {usuariosDelete, 
        usuariosGet, 
        usuariosPost, 
        usuariosPut } from '../controllers/usuarios.js';

export const router = Router()

router.get('/', usuariosGet)

router.post('/', [
        check('nombre', 'El nombre esta vacío').not().isEmpty(),
        check('password', 'El password debe de tener mas de seis letras').isLength({ min:6 }),
        check('correo').custom(noExisteEmail),
        check('rol').custom(existeRol),
        validarCampos,
        // check('correo', 'El correo no es válido').isEmail(),
        // check('rol', 'El rol no es válido').isIn(['ADMIN_ROL', 'USER_ROL']),
    ], 
    usuariosPost)

router.put('/:id',
    [
        check('id', `ID inválido`).isMongoId(),
        check('id').custom(existeUsuarioPorId),
        check('rol').custom(existeRol),
        validarCampos
    ] ,
    usuariosPut
)

router.delete('/:id',
    [
        check('id', `ID inválido`).isMongoId(),
        check('id').custom(existeUsuarioPorId),
        validarCampos
    ],
    usuariosDelete
)


