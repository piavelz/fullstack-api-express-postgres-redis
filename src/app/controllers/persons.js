const knex = require('knex');
const knexConfig = require('../../../knexfile');
const db = knex(knexConfig.development);
const path = require('path');
const redisClient = require('../../config/redisClient');

const index = (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../../view/index.html'));
};


async function validarIdPersona(id){
    const person = await db('persons').select('*').where('person_id', id).first();
    console.log('->',person)
    if (!person){
        
        return 0;
    }else return person; 
}

// 1- Listar todas las personas
const getItems = async (req, res) => {
    const redisKey = 'todas_las_personas';
    try {
        // obtener los datos desde Redis
        const cachedData = await redisClient.get(redisKey);
        if (cachedData) {
            console.log("Datos obtenidos desde Redis");
            return res.status(200).send({ data: JSON.parse(cachedData) });
        } else {
            // Si no hay datos en caché, se hace la consulta a la base de datos
            console.log("Datos obtenidos desde la base de datos");
            const persons = await db('persons').select('*');

            // Almacenar datos en redis por 1h
            await redisClient.setEx(redisKey, 3600, JSON.stringify(persons));
            res.status(200).send({ data: persons });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error', error });
    }
};


// 2- Obtener una persona específica por id
const getItem = async (req, res) => {
    const id = req.params.id;

    const redisKey = `persona_${id}`;

    try {
        const person = await validarIdPersona(id);
        if (person === 0) return res.status(404).send({ message: 'Persona no encontrada' });
        //Obtener los datos desde Redis
        const cachedData = await redisClient.get(redisKey);
        if (cachedData) {
            console.log("Datos obtenidos desde Redis");
            return res.status(200).send({ data: JSON.parse(cachedData) });
        } else {
            // Si no hay datos en cache se consulta a la base de datos
            console.log("Datos obtenidos desde la base de datos");

            // almacenar en redis
            await redisClient.setEx(redisKey, 3600, JSON.stringify(person));
            res.status(200).send({ data: person });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al buscar persona por id', error });
    }
};


// 3- Crear una nueva persona
const createItem = async (req, res) => {
    try {
        const { name, lastName, works, nationality, year } = req.body;
        const [idPerson] = await db('persons').insert({
            person_name: name,
            person_lastName: lastName,
            person_year: year,
            person_nationality: nationality
        }).returning('person_id');

        for (const work of works) {
            const { company, initContract, finishContract, position } = work;
            await db('works').insert({
                work_company: company,
                work_init_contract: initContract,
                work_finish_contract: finishContract,
                work_position: position,
                work_person: idPerson.person_id
            });
        }
        // Elimina el caché de la lista de personas
        await redisClient.del('todas_las_personas');
        res.status(201).send({ message: 'Persona ingresada correctamente' });
    } catch (error) {
        res.status(500).send({ message: 'Error al crear persona', error });
    }
};


// 4- Actualizar una persona existente
const updateItem = async (req, res) => {
    const id = req.params.id;
    const redisKey = `persona_${id}`;
    try {
        const person = await validarIdPersona(id);
        if (person === 0) return res.status(404).send({ message: 'Persona no encontrada' });
        const { name, lastName, nationality, year } = req.body;
        const updateFields = {};
        if (name !== '') updateFields.person_name = name;
        if (lastName !== '') updateFields.person_lastName = lastName;
        if (nationality !== '') updateFields.person_nationality = nationality;
        if (year !== '') updateFields.person_year = year;

        //verificar que existan datos para actualizar
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).send({ message: 'No hay campos para actualizar' });
        }
        await db('persons').where('person_id', id).update(updateFields);

        // Elimina el caché de la persona actualizada y de la lista de todas las personas
        await redisClient.del(redisKey);
        await redisClient.del('todas_las_personas');

        res.status(200).send({ message: 'Datos modificados con éxito' });
    } catch (error) {
        res.status(500).send({ message: 'Error al actualizar', error });
    }
};


// 5- Eliminar a una persona
const deleteItem = async (req, res) => {
    const id = req.params.id;
    const redisKey = `persona_${id}`;
    try {
        // Primero eliminar los trabajos de la persona y luego a la persona
        await db('works').where('work_person', id).del();
        await db('persons').where('person_id', id).del();

        // Elimina el caché de la persona específica y de la lista de todas las personas
        await redisClient.del(redisKey);
        await redisClient.del('todas_las_personas');
        res.status(200).send({ message: 'Persona eliminada correctamente' });
    } catch (error) {
        res.status(500).send({ message: 'Error al eliminar', error });
    }
};



// 6- Listar todos los trabajos de una persona
const getWorks = async (req, res) => {
    const id = req.params.id;
    const redisKey = `trabajos_persona_${id}`;

    try {
        // obtener los datos desde Redis
        const cachedData = await redisClient.get(redisKey);

        if (cachedData) {
            console.log("Datos obtenidos desde Redis");
            return res.status(200).send({ data: JSON.parse(cachedData) });
        } else {
            console.log("Datos obtenidos desde la base de datos");
            // Si no hay datos en caché, se hace la consulta a la base de datos
            const works = await db('works').select('*').where('work_person', id);

            // almacena datos en redis
            await redisClient.setEx(redisKey, 3600, JSON.stringify(works));
            res.status(200).send({ data: works });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al buscar trabajos', error });
    }
};

// 7- Agregar un nuevo trabajo a una persona
const addWork = async (req, res) => {
    const id = req.params.id;
    const redisKey = `trabajos_persona_${id}`;

    try {
        const { company, initContract, finishContract, position } = req.body;
        const newWork = {
            work_company: company,
            work_init_contract: initContract,
            work_finish_contract: finishContract,
            work_position: position,
            work_person: id
        };
        await db('works').insert(newWork);

        // Elimina el caché de los trabajos de la persona 
        await redisClient.del(redisKey);
        res.status(201).send({ message: 'Nuevo trabajo ingresado correctamente', data: newWork });
    } catch (error) {
        res.status(500).send({ message: 'Error al ingresar un nuevo trabajo', error });
    }
};


// 8- Actualizar un trabajo específico
const updateWork = async (req, res) => {
    const personId = req.params.id;
    const workId = req.params.workId;
    const redisKey = `trabajos_persona_${personId}`;

    try {
        const { company, initContract, finishContract, position } = req.body;
        const updateFields = {};
        if (company !== '') updateFields.work_company = company;
        if (initContract !== '') updateFields.work_init_contract = initContract;
        if (finishContract !== '') updateFields.work_finish_contract = finishContract;
        if (position !== '') updateFields.work_position = position;
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).send({ message: 'No hay campos para actualizar' });
        }
        await db('works').where('work_person', personId).where('work_id', workId).update(updateFields);

        // Elimina el caché de los trabajos de la persona
        await redisClient.del(redisKey);

        res.status(200).send({ message: 'Trabajo actualizado correctamente', data: updateFields });
    } catch (error) {
        res.status(500).send({ message: 'Error al actualizar trabajo', error });
    }
};



// 9- Eliminar un trabajo específico
const deleteWork = async (req, res) => {
    const personId = req.params.id;
    const workId = req.params.workId;
    const redisKey = `trabajos_persona_${personId}`;
    try {
        // Elimina el trabajo específico
        await db('works').where('work_person', personId).where('work_id', workId).del();
        // Elimina el cache
        await redisClient.del(redisKey);
        res.status(200).send({ message: 'Trabajo eliminado correctamente' });
    } catch (error) {
        res.status(500).send({ message: 'Error al eliminar trabajo', error });
    }
};
module.exports = {index, getItems, getItem, createItem, updateItem, deleteItem, getWorks, addWork, updateWork, deleteWork};  