import { URL } from 'url';
import express from 'express'
import cors from 'cors'

import { dbConnection } from '../database/config.js';
import { usuariosRouter } from '../routes/usuarios.js'
import { authRouter } from '../routes/auth.js';
import { categoriasRouter } from '../routes/categorias.js';
import { productosRouter } from '../routes/productos.js';

const __dirname = new URL('..', import.meta.url).pathname;
export class Server {
    
    constructor(){
        this.app = express()
        this.port =  process.env.PORT || 8080
        this.paths = {
            auth :      '/api/auth',
            categorias :'/api/categorias',
            productos : '/api/productos',
            usuarios :  '/api/usuarios',
        }
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
        this.app.use(this.paths.auth, authRouter)
        this.app.use(this.paths.categorias, categoriasRouter)
        this.app.use(this.paths.productos, productosRouter)
        this.app.use(this.paths.usuarios, usuariosRouter)

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