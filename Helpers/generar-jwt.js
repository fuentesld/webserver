import jwt from 'jsonwebtoken'

export const generarjwt  = (uid='')=> {
    return new Promise((resolve, reject)=>{
        const payload = {uid}
        jwt.sign(
            payload, 
            process.env.SECRETPRIVATEKEY, 
            {expiresIn: '4h'},
            (err, token)=>{
                if(err){
                    console.log(err);
                    reject('No se pudo generar el token')
                }
                resolve(token)
            }
        )
    })
} 