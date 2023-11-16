import { Router } from 'express';
import { body, param, matchedData } from 'express-validator'

import { coleccionesPermitidas, validarCampos } from '../middlewares/index.js';
import { actualizarImagen, actualizarImagenCloudinary, cargarArchivos, mostrarImagen } from '../controllers/uploads.js';
import { validarArchivoSubir } from '../Helpers/subir-archivo.js';

export const uploadsRouter = Router()

uploadsRouter.get('/:coleccion/:id',
    [
        param('id','El id no es válido')
            .notEmpty()
            .isMongoId(),
        param('coleccion')
            .notEmpty()
            .custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),

            
        validarCampos
    ],
    mostrarImagen
)

uploadsRouter.post('/', 
    validarArchivoSubir,
    cargarArchivos
)

uploadsRouter.put('/:coleccion/:id',
    [
        validarArchivoSubir,
        param('id','El id no es válido')
            .notEmpty()
            .isMongoId(),
        param('coleccion')
            .notEmpty()
            .custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),

            
        validarCampos
    ],
    // actualizarImagen
    actualizarImagenCloudinary
)

// router.delete('/:id',
//     [
//         check('id', `ID inválido`).isMongoId(),
//         check('id').custom(existeUsuarioPorId),
//         validarCampos
//     ],
//     usuariosDelete
// )


