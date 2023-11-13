import { Router } from 'express';
import {query, param, body} from 'express-validator'
import {existeCategoriaPorId } from '../Helpers/db-validators.js';
import { esAdminRol, validarJWT,validarCampos} from '../middlewares/index.js'
import { categoriasDelete, categoriasGet, categoriasGetById, categoriasPost, categoriasPut, noExisteNombreCategoria } from '../controllers/categorias.js';

export const categoriasRouter = Router()

categoriasRouter.get('/', 
    [
        query('limite', 'límite negativo').optional().isInt({min:1}),
        query('desde', 'valor inválido').optional().isInt({min:0}),
        validarCampos,],
    categoriasGet
)

categoriasRouter.get('/:id', 
    [   param('id', `ID inválido`)
            .isMongoId()
            .custom(existeCategoriaPorId),
        validarCampos,
    ],
    categoriasGetById
)

categoriasRouter.post('/', 
    [   validarJWT,
        esAdminRol,
        body('nombre', 'El nombre esta vacío')
            .notEmpty()
            .isString()
            .toLowerCase()
            .custom(noExisteNombreCategoria),
        validarCampos,
    ],
    categoriasPost
)

categoriasRouter.put('/:id', 
    [   validarJWT,
        esAdminRol,
        param('id', `ID inválido`)
            .isMongoId()
            .custom(existeCategoriaPorId),
        body('nombre', 'El nombre esta vacío')
            .optional()
            .notEmpty()
            .isString()
            .toLowerCase()
            .custom(noExisteNombreCategoria),
        validarCampos,
    ],
    categoriasPut
)

categoriasRouter.delete('/:id', 
    [   validarJWT,
        esAdminRol,
        param('id', `ID inválido`)
            .isMongoId()
            .custom(existeCategoriaPorId),
        validarCampos,
    ],
    categoriasDelete
)
