import { Router } from 'express';
import {query, param, body} from 'express-validator'
import { existeProductoPorId, existeCategoriaPorId } from '../Helpers/db-validators.js';
import { esAdminRol, validarJWT,validarCampos} from '../middlewares/index.js'
import { noExisteNombreProducto, productosDelete, productosGet, productosGetById, productosPost, productosPut } from '../controllers/productos.js';

export const productosRouter = Router()

productosRouter.get('/', 
    [
        query('limite', 'límite negativo').optional().isInt({min:1}),
        query('desde', 'valor inválido').optional().isInt({min:0}),
        validarCampos,],
    productosGet
)

productosRouter.get('/:id', 
    [   param('id', `ID inválido`)
            .isMongoId()
            .custom(existeProductoPorId),
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
        body('categoria', 'error en clave de categoría')
            .isMongoId()
            .custom(existeCategoriaPorId),
        validarCampos,
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
    ],
    productosPut
)

productosRouter.delete('/:id', 
    [   validarJWT,
        esAdminRol,
        param('id', `ID inválido`).isMongoId(),
        validarCampos,
        // buscaProductoId,
    ],
    productosDelete
)
