import { Router } from 'express';
import {check, query, param, body} from 'express-validator'

import { noExisteEmail, existeRol, existeUsuarioPorId, existeCategoria } from '../Helpers/db-validators.js';

import { esAdminRol, tieneRol, validarJWT,validarCampos, sanitizaProducto} from '../middlewares/index.js'

import { productosDelete, productosGet, productosGetById, productosPost, productosPut } from '../controllers/productos.js';

export const productosRouter = Router()

productosRouter.get('/', 
    [
        query('limite', 'límite negativo').optional().isInt({min:1}),
        query('desde', 'valor inválido').optional().isInt({min:0}),
        validarCampos,],
    productosGet
)

productosRouter.get('/:id', 
    [   param('id', `ID inválido`).isMongoId(),
        validarCampos,
    ],
    productosGetById
)

productosRouter.post('/', 
    [   validarJWT,
        esAdminRol,
        body('nombre', 'El nombre esta vacío').notEmpty().isString().toLowerCase(),
        body('precio','El precio debe ser un string y positivo').optional().isString().isCurrency({allow_negatives:false}),
        body('categoria', 'error en clave de  categoría').isMongoId(),
        validarCampos,
        sanitizaProducto,
        validarCampos,
    ],
    productosPost
)

productosRouter.put('/:id', 
    [   validarJWT,
        esAdminRol,
        param('id', `ID inválido`).isMongoId(),
        body('nombre', 'El nombre esta vacío').optional().notEmpty().isString().toLowerCase(),
        body('precio','El precio debe ser un string y positivo').optional().isString().isCurrency({allow_negatives:false}),
        body('categoria', `ID categoria  inválido`).optional().isMongoId(),
        validarCampos,
        sanitizaProducto,
        validarCampos,
    ],
    productosPut
)

productosRouter.delete('/:id', 
[   validarJWT,
    esAdminRol,
    param('id', `ID inválido`).isMongoId(),
    validarCampos,],
    existeCategoria,
    productosDelete
)



