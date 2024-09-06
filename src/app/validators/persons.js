const { index } = require("../controllers/persons");


const validateIdPerson = (req,res,next)=>{
    const {id} = req.params;
    console.log('este es el id ingresado :) ->',id);

    if(id && (isNaN(Number(id)))|| typeof Number(id) !== 'number'){
        return res
        .status(400)
        .send({message:'debe ingresar un id, y debe ser tipo numerico'})
    }
    next();
    }

//Validara datos de entrada para crear un nuevo work

const validateNewWork = (req,res,next)=>{

    const {company, initContract,finishContract,position} = req.body

    if(!company || typeof company !== 'string'){
        return res
        .status(400)
        .send({message:'Compañia es requerida y debe ser tipo string'})
    }
    else if(!initContract || isNaN(Date.parse(initContract))){
        return res
        .status(400)
        .send({message:'inicio de contrato es requerido y debe ser tipo date'})
    }
    else if(!finishContract || isNaN(Date.parse(finishContract))){
        return res
        .status(400)
        .send({message:'Termino de contrato es requerido y debe ser tipo date'})
    }
    else if(!position || typeof company !== 'string'){
        return res
        .status(400)
        .send({message:'Posicion es requerida  y debe ser tipo string'})
    }
    
    next()
}


//Validara la actualizacion de personas
const validateUpdatePerson = (req,res,next)=>{
    
    const {name, lastName,works,nationality,year}= req.body
    if(name && typeof name !== 'string'){
        return res
        .status(400)
        .send({message:'El nombre debe ser tipo string'})
    }
    else if(lastName && typeof lastName !== 'string'){
        return res
        .status(400)
        .send({message:'El apellido debe ser tipo string'})
    }
    else if(works && !Array.isArray(works)){
        return res
        .status(400)
        .send({message:'Work debe ser tipo array'})
    }
    else if(nationality && typeof nationality !== 'string'){
        return res
        .status(400)
        .send({message:'La nacionaliodad debe ser tipo string'})
    }
    else if(year && (isNaN(Number(year)))|| typeof Number(year) !== 'number'){
        return res
        .status(400)
        .send({message:'El año debe ser tipo numerico'})
    }
    next()
}



//Valida Actualizar un trabajo

const validateUpdateWork = (req,res,next)=>{
    const {company, initContract,finishContract,position} = req.body

    if(company && typeof company !== 'string'){
        return res.status(400).send({message:'La compañia debe ser tipo string'})
    }
    else if(initContract && isNaN(Date.parse(initContract))){
        return res
        .status(400)
        .send({message:'inicio de contrato debe ser tipo date'})
    }
    else if(finishContract && isNaN(Date.parse(finishContract))){
        return res
        .status(400)
        .send({message:'Termino de contrato debe ser tipo date'})
    }
    else if(position && typeof position !== 'string'){
        return res
        .status(400)
        .send({message:'Posicion debe ser tipo string'})
    }

    next()
}


//Validara datos para crear nueva persona
const validateNewPerson = (req,res,next)=>{

    const {name, lastName,works,nationality,year}= req.body

    if(!name || typeof name !== 'string'){
        return res
        .status(400)
        .send({message:'El nombre es requerido y debe ser tipo string'})

    } else if(!lastName || typeof lastName !== 'string'){
        return res
        .status(400)
        .send({message:'El apellido es requerido y debe ser tipo string'})

    }else if(!nationality || typeof nationality !== 'string'){
        return res
        .status(400)
        .send({message:'La nacionaliodad es requerida y debe ser tipo string'})

    }else if(!year || typeof Number(year) !== 'number'){
        return res
        .status(400)
        .send({message:'El año es requerido y debe ser tipo numerico'})
    }



// //*******************Validar works *******************/
    if(!Array.isArray(works)){
        return res
        .status(400)
        .send({message:'Works es un campo requerido y debe ser un array'})
    }

    works.forEach(work => {
        if(!work.company || typeof work.company !== 'string'){
            return res
            .status(400)
            .send({message:'Compañia es requerida y debe ser tipo string'})
        }
        else if(!work.initContract || isNaN(Date.parse(work.initContract))){
            return res
            .status(400)
            .send({message:'inicio de contrato es requerido y debe ser tipo date'})
        }
        else if(!work.finishContract || isNaN(Date.parse(work.finishContract))){
            return res
            .status(400)
            .send({message:'Termino de contrato es requerido y debe ser tipo date'})
        }
        else if(!work.position || typeof work.company !== 'string'){
            return res
            .status(400)
            .send({message:'Posicion es requerida  y debe ser tipo string'})
        }
    });

    next()
}






module.exports={validateIdPerson, validateNewWork,validateNewPerson,validateUpdatePerson,validateUpdateWork}
