import { response } from 'express';
import {v4 as uuid4} from 'uuid'

const __dirname = new URL('..', import.meta.url).pathname;
const extensionesDefault = ['jpg', 'png', 'gif', 'jpeg']

export const subirArchivo = (files, extensionesValidas = extensionesDefault, carpeta = '')=> {
    
    return new Promise((resolve, reject)=> {
        const {archivo} = files
        const nombreCortado = archivo.name.split('.')
        const extension = nombreCortado[ nombreCortado.length - 1 ]
        
        if (!extensionesValidas.includes(extension)){
            return reject(`La extension no es válida, utilice ${extensionesValidas}`)
        }

        const nombreTemporal = uuid4() + '.' + extension

        const uploadPath = __dirname + 'uploads/' + carpeta+'/' + nombreTemporal;

        archivo.mv(uploadPath, (err) => {
            if (err) {
                clg('hay error')
                return reject(err)
            }
            resolve(nombreTemporal)
        })
    }) 
    
}

export const validarArchivoSubir = (req, res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({msg:'No hay archivos que subir.'});
        return;
    }

    next()
}