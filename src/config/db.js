const knex = require('knex')
const knexConfig = require('../../knexfile')

const db= knex(knexConfig.development)

const dbConnect = async () =>{
    try{
        await db.raw('SELECT 1+1 AS result')
        console.log('Conexion exitosa a base de datos postgres')

    }catch(error){
        console.log('Error al conectarse a la base de datos.')
        process.exit(1)
    } 
}

module.exports = {db, dbConnect}