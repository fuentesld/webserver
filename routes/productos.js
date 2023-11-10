import { Router } from 'express';
import {check, query, param, body} from 'express-validator'

import { noExisteEmail, existeRol, existeUsuarioPorId, existeCategoria, existeProductoPorId,   existeCategoriaPorId } from '../Helpers/db-validators.js';

import { esAdminRol, tieneRol, validarJWT,validarCampos, sanitizaProducto, sanitizaIdProducto} from '../middlewares/index.js'

import { BuscaNombreProducto, InicializaProducto, actualizarProductoCategoria, actualizarProductoNombre, actualizarProductoPrecio, actualizarProductoUsuario, buscaProductoId, noExisteNombreProducto, productosDelete, productosGet, productosGetById, productosPost, productosPut } from '../controllers/productos.js';

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
        body('nombre', 'El nombre esta vacío')
            .notEmpty()
            .isString()
            .toLowerCase()
            .custom(noExisteNombreProducto),
        body('precio','El precio debe ser un string y positivo')
            .optional()
            .isString()
            .isCurrency({allow_negatives:false}),
        body('categoria', 'error en clave de  categoría')
            .isMongoId()
            .custom(existeCategoriaPorId),
        validarCampos,
        InicializaProducto,
        actualizarProductoNombre,
        actualizarProductoPrecio,
        actualizarProductoCategoria,
        actualizarProductoUsuario,
    ],
    productosPost
)

productosRouter.put('/:id', 
    [   validarJWT,
        esAdminRol,
        param('id', `ID inválido`)
            .isMongoId()
            .custom(existeProductoPorId),
        body('nombre', 'El nombre esta vacío')
            .optional()
            .notEmpty()
            .isString()
            .toLowerCase()
            .custom(noExisteNombreProducto),
        body('precio','El precio debe ser un string y positivo')
            .optional()
            .isString()
            .isCurrency({allow_negatives:false}),
        body('categoria', `ID categoria  inválido`)
            .optional()
            .isMongoId()
            .custom(existeCategoriaPorId),
        validarCampos,
        buscaProductoId,
        actualizarProductoNombre,
        actualizarProductoPrecio,
        actualizarProductoCategoria,
        actualizarProductoUsuario,
    ],
    productosPut
)

productosRouter.delete('/:id', 
    [   validarJWT,
        esAdminRol,
        param('id', `ID inválido`).isMongoId(),
        validarCampos,
        buscaProductoId,
    ],
    productosDelete
)



