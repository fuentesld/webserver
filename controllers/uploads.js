import { URL } from 'url';
import * as fs from 'fs'
import { request, response } from 'express';
import {v2 as cloudinary} from 'cloudinary';

import { subirArchivo } from '../Helpers/index.js';
import { Usuario, Producto} from '../models/index.js';

const __dirname = new URL('..', import.meta.url).pathname;
cloudinary.config(process.env.CLOUDINARY_URL)

export const cargarArchivos = async(req, res = response) => {

    console.log('req.files >>>', req.files); // eslint-disable-line 
    try {
        const nombre = await subirArchivo(req.files,undefined, 'imgs')
        res.json({nombre})
    } catch (msg) {
        console.log(msg);
        res.status(400).json({msg})
    }
    
}


export const actualizarImagen = async(req= request, res = response)=>{
    const {coleccion, id} = req.params

    let modelo
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if(!modelo){
                return res.status(400).json({msg:`No existe un usuario con el id ${id}`})
            } 
            break;

        case 'productos':
            modelo = await Producto.findById(id)
            if(!modelo){
                return res.status(400).json({msg:`No existe un producto con el id ${id}`})
            } 
            break;
    
        default:
            return res.status(500).json({msg:'Se me olvido validar esto'})
            break;
    }

    if (modelo.img){
        const pathImagen = __dirname + 'uploads/' + coleccion + '/' + modelo.img
        console.log(pathImagen);
        if (fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen)
        }
    }

    const nombreArchivo = await subirArchivo(req.files, undefined, coleccion)
    modelo.img = await nombreArchivo
    await modelo.save()

    res.json(modelo)
}

export const actualizarImagenCloudinary = async(req= request, res = response)=>{

    const {coleccion, id} = req.params

    let modelo
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if(!modelo){
                return res.status(400).json({msg:`No existe un usuario con el id ${id}`})
            } 
            break;

        case 'productos':
            modelo = await Producto.findById(id)
            if(!modelo){
                return res.status(400).json({msg:`No existe un producto con el id ${id}`})
            } 
            break;
    
        default:
            return res.status(500).json({msg:'Se me olvido validar esto'})
            break;
    }

    if (modelo.img){
        const nombreArr = modelo.img.split('/')
        const nombre = nombreArr[nombreArr.length - 1]
        const [public_id] = nombre.split('.')
        cloudinary.uploader.destroy(public_id)
    }

    const {tempFilePath} = req.files.archivo
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath)
    modelo.img = secure_url
    await modelo.save()

    // const nombreArchivo = await subirArchivo(req.files, undefined, coleccion)
    // modelo.img = await nombreArchivo

    res.json(modelo)
}
// *+++++++++++++++++++++++++++++++++++++++++++++++++
export const mostrarImagen = async (req, res) => {
    const {id, coleccion} = req.params
    let modelo, defaultImage
    switch (coleccion) {
        case 'usuarios':
            defaultImage = __dirname + 'assets/anonymous.jpg'
            modelo = await Usuario.findById(id)
            if(!modelo){
                return res.status(404).sendFile(defaultImage)
            } 
            break;

        case 'productos':
            defaultImage = __dirname + 'assets/no-image.jpg'
            modelo = await Producto.findById(id)
            if(!modelo){
                return res.status(404).sendFile(defaultImage)
            }
            break;
    
        default:
            return res.status(500).json({msg:'Se me olvido validar esto'})
            break;
    }

    if (modelo.img){
        const pathImagen = __dirname + 'uploads/' + coleccion + '/' + modelo.img
        console.log(pathImagen);
        if (fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen)
        }
    }

    res.status(404).sendFile(defaultImage)
}