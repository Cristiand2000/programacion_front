const url = 'https://api-programacion.onrender.com/api/programaciones' 
//url de la api. Al desplegarla en el servidor local colocar la api del servi
const listar = async() => {
    let respuesta = ''
    let body = document.getElementById('contenido')
    fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then((resp) => resp.json()) // Obtener la respuesta y convertirla a json
    .then(function(data){
        let listaProgramaciones = data.programaciones
        listaProgramaciones.map(function(programacion){
            respuesta += `<tr><td>${programacion._id}</td>`+
                        `<td>${programacion.clase}</td>`+
                        `<td>${programacion.instructor}</td>`+
                        `<td>${programacion.fecha}</td>`+
                        `<td>${programacion.hora_inicio}</td>`+
                        `<td>${programacion.hora_fin}</td>`+
                        `<td>${programacion.descripcion}</td>`+
                        `<td><a class="waves-effect waves-light btn modal-trigger" href="#modal1" onclick='editar(${JSON.stringify(programacion)})'>Editar</a>
                        <a class="waves-effect waves-light btn modal-denger red"  onclick='eliminar(${JSON.stringify(programacion)})'>Eliminar</a></td></tr>`  
                        body.innerHTML = respuesta

        })
    })
    //alert('En desarrollo...')
}

const registrar = async () => {
    let _clase = document.getElementById('clase').value;
    let _instructor = document.getElementById('instructor').value;
    let _fecha = document.getElementById('fecha').value;
    let _hora_inicio = document.getElementById('hora_inicio').value;
    let _hora_fin = document.getElementById('hora_fin').value;
    let _descripcion = document.getElementById('descripcion').value;
    let fechaActual = new Date().toISOString().split('T')[0];
  
    // Validar que todos los campos estén completos
    if (!_clase || !_instructor || !_fecha || !_hora_inicio || !_hora_fin || !_descripcion) {
      Swal.fire(
        'Todos los campos son obligatorios',
        '',
        'error'
      );
      return; // Detener la ejecución de la función
    }
  
    // Validar que el día no sea anterior a la fecha actual
    if (_fecha < fechaActual) {
      Swal.fire(
        'El campo fecha debe ser superior o igual a la fecha actual',
        '',
        'error'
      );
      return; // Detener la ejecución de la función
    }
  
    if (_hora_inicio < _hora_fin) {
      let _programacion = {
        clase: _clase,
        instructor: _instructor,
        fecha: _fecha,
        hora_inicio: _hora_inicio,
        hora_fin: _hora_fin,
        descripcion: _descripcion
      };
  
      fetch(url, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(_programacion),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      })
        .then((resp) => resp.json())
        .then(json => {
          Swal.fire(
            json.msg,
            'Se Registró Exitosamente',
            'success'
          );
          setTimeout(function () {
            window.location.href = "listar.html";
          }, 3000);
  
        });
    } else {
      Swal.fire(
        'La hora de Inicio debe ser menor a la Hora Final',
        '',
        'error'
      );
    }
  }
  


const editar = (programacion) => {
    document.getElementById('id').value = programacion._id;
    document.getElementById('clase').value = programacion.clase;
    document.getElementById('instructor').value = programacion.instructor;
    document.getElementById('fecha').value = programacion.fecha;
    document.getElementById('hora_inicio').value = programacion.hora_inicio;
    document.getElementById('hora_fin').value = programacion.hora_fin; 
    document.getElementById('descripcion').value = programacion.descripcion;
}

const actualizar = async () => {
    const _id = document.getElementById('id').value;
    const _clase = document.getElementById('clase').value;
    const _instructor = document.getElementById('instructor').value;
    const _fecha = document.getElementById('fecha').value;
    const _hora_inicio = document.getElementById('hora_inicio').value;
    const _hora_fin = document.getElementById('hora_fin').value;
    const _descripcion = document.getElementById('descripcion').value;

    let fechaActual = new Date().toISOString().split('T')[0];

    if (!_clase || !_instructor || !_fecha || !_hora_inicio || !_hora_fin || !_descripcion) {
        Swal.fire(
          'Todos los campos son obligatorios',
          '',
          'error'
        );
        return; // Detener la ejecución de la función
      }

    if (_fecha < fechaActual) {
        Swal.fire(
          'No es posible registrar una programacion en días anteriores a la fecha actual',
          '',
          'error'
        );
        return; // Detener la ejecución de la función
      }

      if(_hora_inicio< _hora_fin){
        let _programacion = {
            _id:_id,
            clase: _clase,
            instructor: _instructor,
            fecha: _fecha,
            hora_inicio: _hora_inicio,
            hora_fin: _hora_fin,
            descripcion:_descripcion
        };

      
        fetch(url, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify(_programacion),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
            .then((resp) => resp.json())
            .then(json => {
                Swal.fire({
                    title: json.msg,
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            })
            .catch(error => {
                console.error(error);
                Swal.fire(
                    'Ocurrió un error al actualizar el hurto. Por favor, inténtalo nuevamente.',
                    '',
                    'error'
                );
            });
    } else {
        Swal.fire(
           'La hora de Inicio debe ser menor a la Hora Final',
           '',
           'error'
         )
   }
}


const eliminar = (id) => {
  Swal.fire({
    title: '¿Estás seguro de eliminar esta agenda?',
    text: '¡Este cambio no se puede revertir!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, Eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Eliminado',
        'El archivo ha sido eliminado.',
        'success'
      );
      
      let agenda = {
        _id: id
      };
      
      fetch(url, {
        method: 'DELETE',
        mode: 'cors',
        body: JSON.stringify(agenda),
        headers: {'Content-type': 'application/json; charset=UTF-8'}
      })
      .then((resp) => resp.json())
      .then((json) => {
        Swal.fire(
          json.msg,
          'Se ha eliminado exitosamente',
          'success'
        );
        setTimeout(function() {
          window.location.href = 'listar.html';
        }, 3000);
      });
    } else {
      Swal.fire(
        'Cancelado',
        'La eliminación ha sido cancelada.',
        'info'
      );
    }
  });
};



if(document.querySelector('#btnRegistrar')){
    document.querySelector('#btnRegistrar')
    .addEventListener('click', registrar)
}
if(document.querySelector('#btnActualizar')){
    document.querySelector('#btnActualizar')
    .addEventListener('click', actualizar)
}
/* // ELIMINAR DATOS
const eliminar = async()=>{
    let _id = document.getElementById('id').value
    if(_id.length > 0){ */
