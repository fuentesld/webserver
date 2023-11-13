import { Router } from 'express';
import {query, param, body} from 'express-validator'
import { buscar } from '../controllers/buscar.js';

export const buscarRouter = Router()

buscarRouter.get('/:coleccion/:termino',
    buscar
)