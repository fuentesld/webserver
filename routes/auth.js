import { Router } from 'express';
import { body } from 'express-validator'

import { validarCampos } from '../middlewares/validar-campos.js';

import { authGet, authPost, googleSignIn } from '../controllers/auth.js';

export const authRouter = Router()

authRouter.get('/', 
    
    authGet
)

authRouter.post('/login', 
[
    body('correo', 'El correo es obligatorio').isEmail(),
    body('password', 'El password no es válido').notEmpty(),
    validarCampos],
    authPost)

    authRouter.post('/google', 
    [
        body('id_token', 'El token_id es obligatorio').notEmpty(),
        validarCampos],
        googleSignIn)

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


