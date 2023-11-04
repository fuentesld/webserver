import { Router } from 'express';
import { body } from 'express-validator'

import { validarCampos } from '../middlewares/validar-campos.js';

import { authGet, authPost } from '../controllers/auth.js';

export const authRouter = Router()

authRouter.get('/', 
    
    authGet
)

authRouter.post('/login', 
[
    body('correo', 'El correo es obligatorio').isEmail(),
    body('password', 'El password no es válido').notEmpty(),
    validarCampos],
// [
//         check('nombre', 'El nombre esta vacío').not().isEmpty(),
//         check('password', 'El password debe de tener mas de seis letras').isLength({ min:6 }),
//         check('correo').custom(noExisteEmail),
//         check('rol').custom(existeRol),
//         validarCampos,
//         // check('correo', 'El correo no es válido').isEmail(),
//         // check('rol', 'El rol no es válido').isIn(['ADMIN_ROL', 'USER_ROL']),
//     ], 
    authPost)

// router.put('/:id',
//     [
//         check('id', `ID inválido`).isMongoId(),
//         check('id').custom(existeUsuarioPorId),
//         check('rol').custom(existeRol),
//         validarCampos
//     ] ,
//     usuariosPut
// )

// router.delete('/:id',
//     [
//         check('id', `ID inválido`).isMongoId(),
//         check('id').custom(existeUsuarioPorId),
//         validarCampos
//     ],
//     usuariosDelete
// )


