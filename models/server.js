import { URL } from 'url';
import express from 'express'
import cors from 'cors'

import { dbConnection } from '../database/config.js';
import { usuarioRouter } from '../routes/usuarios.js'
import { authRouter } from '../routes/auth.js';

const __dirname = new URL('..', import.meta.url).pathname;
export class Server {
    
    constructor(){
        this.app = express()
        this.port =  process.env.PORT || 8080
        this.usuariosPath = '/api/usuarios'
        this.authPath = '/api/auth'
        this.conectarDB()
        this.middlewares()
        this.routes()
    }

    async conectarDB(){
        await dbConnection()
    }

    middlewares(){
        //* CORS
        this.app.use(cors())
        // * Directorio Público
        this.app.use(express.static('public'))
        // * Body Perser
        this.app.use(express.json())
    }

    routes(){
        this.app.use(this.authPath, authRouter)
        this.app.use(this.usuariosPath, usuarioRouter)

        this.app.get('*', function (req, res) {
            res.sendFile( __dirname + '/public/404/index.html')
        
        })
    }

    listen() {
        this.app.listen(this.port, ()=>{
            console.log(`Aplicación corriendo en puerto ${this.port} `);
        })
    }
}