import { Router } from 'express';
import {check, query, param, body} from 'express-validator'

import { noExisteEmail, existeRol, existeUsuarioPorId, existeCategoria } from '../Helpers/db-validators.js';

import { esAdminRol, tieneRol, validarJWT,validarCampos} from '../middlewares/index.js'
import { categoriasDelete, categoriasGet, categoriasGetById, categoriasPost, categoriasPut } from '../controllers/categorias.js';

export const categoriasRouter = Router()

categoriasRouter.get('/', 
    [
        query('limite', 'límite negativo').optional().isInt({min:1}),
        query('desde', 'valor inválido').optional().isInt({min:0}),
        validarCampos,],
    categoriasGet
)

categoriasRouter.get('/:id', 
    [   param('id', `ID inválido`).isMongoId(),
        validarCampos,
    ],
    existeCategoria,
    categoriasGetById
)

categoriasRouter.post('/', 
    [   validarJWT,
        esAdminRol,
        body('nombre', 'El nombre esta vacío').notEmpty(),
        validarCampos,],
    categoriasPost
)

categoriasRouter.put('/:id', 
    [   validarJWT,
        esAdminRol,
        param('id', `ID inválido`).isMongoId(),
        body('nombre', 'El nombre esta vacío').notEmpty(),
        validarCampos,],
        existeCategoria,
    categoriasPut
)

categoriasRouter.delete('/:id', 
[   validarJWT,
    esAdminRol,
    param('id', `ID inválido`).isMongoId(),
    validarCampos,],
    existeCategoria,
    categoriasDelete
)



