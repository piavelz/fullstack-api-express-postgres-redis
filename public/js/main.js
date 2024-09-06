document.addEventListener('DOMContentLoaded', () => {
    // Función para manejar errores y mostrar mensajes
    const msjError = (message, error) => {
        console.error(message, error);
        alert(message);
    };

    // Función para manejar respuestas y mostrar mensajes
    const handleResponse = async (response) => {
        if (!response.ok){
            throw new Error(`Error: ${response.statusText}`)
        } 
        const msj = await response.json()
        return msj
    };
    function validateId (id){
        if(!id)return res.status(400);
    }

    // Botón para listar todas las personas
    document.getElementById('btn-get-all-persons').addEventListener('click', async () => {
        try {
            const response = await fetch('/persons')
            const datos = await handleResponse(response);
            displayPersons('getPersons', datos.data); 
        } catch (error) {
            msjError(`Error al obtener las personas: ${error.message}`);
        }
    });

    // Botón para obtener una persona específica por ID
    document.querySelector('#personId + button').addEventListener('click', async () => {
        const personId = document.getElementById('personId').value;
        try {
            validateId(personId);
            const response = await fetch(`/persons/${personId}`);
            if (!response.ok) {
                const errorData = await response.json();
                return msjError(`Error : ${errorData.message}`);
            }
            const datos = await handleResponse(response);
            
            displayPersons('getPerson',[datos.data]); 
        } catch (error) {
            msjError('Error, no se encuentra persona con el id indicado.', error);
        }
    });

// Botón para crear una nueva persona
document.getElementById('createPersonButton').addEventListener('click', async () => {
    // Obtener valores del formulario
    const name = document.getElementById('name').value;
    const lastName = document.getElementById('lastName').value;
    const nationality = document.getElementById('nationality').value;
    const year = document.getElementById('year').value;
    const company = document.getElementById('createworkCompany').value;
    const position = document.getElementById('createworkPosition').value;
    const initContract = document.getElementById('createworkInitContract').value;
    const finishContract = document.getElementById('createworkFinishContract').value;
    // Crear un objeto 'works' con los datos del trabajo
    const works = [{
        company,
        position,
        initContract,
        finishContract
    }];

    try {
        // Enviar solicitud para crear una nueva persona con trabajo
        const response = await fetch('/persons', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, lastName, nationality, year, works }),
        });
        if(response.ok){
            alert('Persona creada con exito');
        }else{
            alert('Ingrese todos los datos solicitados')
        }
            
        
    } catch (error) {
        alert('Error al crear la persona. Inténtalo de nuevo más tarde.');
        console.error('Error:', error);
    }
});


    // Botón para actualizar una persona existente
    document.querySelector('#updateYear + button').addEventListener('click', async () => {
        const id = document.getElementById('updatePersonId').value;
        const name = document.getElementById('updateName').value;
        const lastName = document.getElementById('updateLastName').value;
        const nationality = document.getElementById('updateNationality').value;
        const year = document.getElementById('updateYear').value;

        try {
            const response = await fetch(`/persons/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, lastName, nationality, year }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                return msjError(`Error al actualizar: ${errorData.message}`);
            }
                alert('Datos actualizados correctamente');
        } catch (error) {
            msjError('Error al actualizar, persona no encontrada', error);
        }
    });

    // Botón para eliminar una persona
    document.querySelector('#deletePersonId + button').addEventListener('click', async () => {
        const id = document.getElementById('deletePersonId').value;

        try {
            const response = await fetch(`/persons/${id}`, {
                method: 'DELETE',
            });
            const json = await handleResponse(response);
            alert(json.message);
        } catch (error) {
            msjError('Error al eliminar la persona:', error);
        }
    });

    // Botón para listar trabajos de una persona
    document.querySelector('#personWorksId + button').addEventListener('click', async () => {
        const id = document.getElementById('personWorksId').value;

        try {
            validateId(id);
            const response = await fetch(`/persons/${id}/works`);
            const datos = await handleResponse(response);
            displayWorks('worksContainer',datos.data);
        } catch (error) {
            msjError('Error al listar los trabajos:', error);
        }
    });

    // Botón para agregar un trabajo a una persona
    document.querySelector('#workFinishContract + button').addEventListener('click', async () => {
        const id = document.getElementById('workPersonId').value;
        const company = document.getElementById('workCompany').value;
        const position = document.getElementById('workPosition').value;
        const initContract = document.getElementById('workInitContract').value;
        const finishContract = document.getElementById('workFinishContract').value;

        try {
            const response = await fetch(`/persons/${id}/works`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ company, position, initContract, finishContract }),
            });
            const json = await handleResponse(response);
            alert(json.message);
        } catch (error) {
            msjError('Error al agregar el trabajo:', error);
        }
    });

    // Botón para actualizar un trabajo específico
    document.querySelector('#updateWorkFinishContract + button').addEventListener('click', async () => {
        const personId = document.getElementById('updateWorkPersonId').value;
        const workId = document.getElementById('updateWorkId').value;
        const company = document.getElementById('updateWorkCompany').value;
        const position = document.getElementById('updateWorkPosition').value;
        const initContract = document.getElementById('updateWorkInitContract').value;
        const finishContract = document.getElementById('updateWorkFinishContract').value;

        try {
            const response = await fetch(`/persons/${personId}/works/${workId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ company, position, initContract, finishContract }),
            });
            const json = await handleResponse(response);
            alert(json.message);
        } catch (error) {
            msjError('Error al actualizar el trabajo:', error);
        }
    });

    // Botón para eliminar un trabajo específico
    document.querySelector('#deleteWorkId + button').addEventListener('click', async () => {
        const personId = document.getElementById('deleteWorkPersonId').value;
        const workId = document.getElementById('deleteWorkId').value;

        try {
            const response = await fetch(`/persons/${personId}/works/${workId}`, {
                method: 'DELETE',
            });
            const json = await handleResponse(response);
            alert(json.message);
        } catch (error) {
            msjError('Error al eliminar el trabajo:', error);
        }
    });

    // Función para mostrar las personas en el DOM
    function displayPersons(section, persons) {
        const container = document.getElementById(section);
        container.style.display= 'block';
        container.innerHTML = ''; // Limpia el contenedor

        persons.forEach(person => {
            const personElement = document.createElement('div');
            personElement.className = 'person-card';
            personElement.textContent = `ID: ${person.person_id}, Nombre: ${person.person_name}, Apellido: ${person.person_lastName}, Año: ${person.person_year}, Nacionalidad: ${person.person_nationality}`;
            container.appendChild(personElement);
        });
    }

    // Función para mostrar los trabajos en el DOM
    function displayWorks(section,works) {
    const container = document.getElementById(section);
    container.style.display= 'block';
    container.innerHTML = ''; 
    works.forEach(work => {
        
        const workElement = document.createElement('div');
        workElement.className = 'work-card';
        const fechaInicio = new Date(work.work_init_contract);
        const fechatermino = new Date(work.work_finish_contract);

        const opciones = { year: 'numeric', month: 'long' };
        
        workElement.textContent = `
        ID: ${work.work_id},
        Empresa: ${work.work_company}, 
        Posición: ${work.work_position},
        Fecha de inicio: ${fechaInicio.toLocaleDateString('es-ES', opciones)},
        Fecha de termino: ${fechatermino.toLocaleDateString('es-ES', opciones)}`;
        container.appendChild(workElement);
    });
}
});
