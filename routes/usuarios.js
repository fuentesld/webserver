import { Router } from 'express';
import {usuariosDelete, 
        usuariosGet, 
        usuariosPost, 
        usuariosPut } from '../controllers/usuarios.js';

export const router = Router()

router.get('/', usuariosGet)

router.post('/', usuariosPost)

router.put('/:id', usuariosPut)

router.delete('/', usuariosDelete)


