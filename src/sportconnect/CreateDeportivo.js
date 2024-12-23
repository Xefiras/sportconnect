import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const URI = 'http://localhost:8080/api/deportivos/createDeportivo';
const URICNRE = 'http://localhost:8080/api/deportivos/obtenerDeportivos'

const CompCreateDeportivo = () => {
    const navigate = useNavigate();
    const [numero_registro, setNumeroRegistro] = useState('')
    const [nombre, setNombre] = useState('')
    const [acepta_mascotas, setAceptaMascotas] = useState('');
    const [tiene_tienda, setTienda] = useState('');
    const [tiene_vestidores, setVestidores] = useState('');
    const [tiene_regaderas, setRegaderas] = useState('');
    const [tiene_medico, setMedico] = useState('');
    const [formErrors, setFormErrors] = useState({
        nombre: '',
        numero_registro: ''
    });

    const checkNumeroRegistroExistente = async () => {
        try {    
            // Realizar una solicitud GET para obtener todos los deportivos
            const response = await axios.get(URICNRE);
            const deportivos = response.data;
            console.log("datos", response.data)        

            // Verificar si alguna cancha tiene el mismo número que la nueva cancha
            const numeroRegistroExistente = deportivos.find(deportivo => (
                console.log("comparacion",parseInt(numero_registro), parseInt(deportivo.numero_registro)),
                //IMPORTANTE PARSEAR INT O LA COMPARACION NO VA A FUNCIONAR
                parseInt(deportivo.numero_registro) === parseInt(numero_registro)      
            ));
            
            console.log("numeroRegistroExistente", numeroRegistroExistente)        

            return numeroRegistroExistente !== undefined;
            
            
        } catch (error) {
            console.error('Error al verificar la existencia del NR:', error);
        }
    };

    const store = async (e) => {
        e.preventDefault();
    
        const numeroRegistroExistente = await checkNumeroRegistroExistente();
    
        if (numeroRegistroExistente) {
            showErrorAlert("Ya existe un deportivo con ese número de registro");
            return;
        }
    
        try {
            const isValid = validateForm();
            if (isValid) {
                const response = await axios.post(URI, {
                    nombre,
                    numero_registro,
                    acepta_mascotas,
                    tiene_tienda,
                    tiene_vestidores,
                    tiene_regaderas,
                    tiene_medico,
                });
    
                if (response.status === 201) {
                    const ID_Deportivo = response.data.ID_Deportivo;
                    if (ID_Deportivo) {
                        navigate(`/createDireccion/${ID_Deportivo}`);
                    } else {
                        showErrorAlert("No se pudo obtener el ID del deportivo creado.");
                    }
                } else {
                    showErrorAlert("Hubo un error al crear el deportivo. Inténtalo de nuevo.");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            showErrorAlert("Hubo un error al crear el deportivo. Inténtalo de nuevo.");
        }
    };
    

    const showErrorAlert = (message) => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            confirmButtonText: 'OK'
        });
    };

    const validateForm = () => {
        let valid = true;
        const errors = {
            nombre: '',
            numero_registro: ''
        };

        if (!nombre) {
            errors.nombre = "El nombre es requerido";
            valid = false;
        }

        if (!numero_registro) {
            errors.numero_registro = "El número de registro es requerido";
            valid = false;
        }

        if (isNaN(numero_registro)) {
            errors.numero_registro = "El número de registro debe ser numérico";
            valid = false;
        }

        setFormErrors(errors);
        return valid;
    };

    return (
        <div className="formulario">
            <h1>Ingresar nuevo deportivo</h1>
            <h1>Información General</h1>
            <form onSubmit={store}>
                <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={`form-control ${formErrors.nombre && 'is-invalid'}`} />
                    {formErrors.nombre && <div className="invalid-feedback">{formErrors.nombre}</div>}
                </div>
                <div className="form-group">
                    <label>Número de Registro</label>
                    <input type="text" value={numero_registro} onChange={(e) => setNumeroRegistro(e.target.value)} className={`form-control ${formErrors.numero_registro && 'is-invalid'}`} maxLength={6} />
                    {formErrors.numero_registro && <div className="invalid-feedback">{formErrors.numero_registro}</div>}
                </div>
                <div className="form-group">
                    <label>¿Acepta Mascotas?</label>
                    <input type="checkbox" checked={acepta_mascotas} onChange={(e) => setAceptaMascotas(e.target.checked)} />
                    <label>¿Tiene Tienda?</label>
                    <input type="checkbox" checked={tiene_tienda} onChange={(e) => setTienda(e.target.checked)} />
                    <label>¿Tiene Vestidores?</label>
                    <input type="checkbox" checked={tiene_vestidores} onChange={(e) => setVestidores(e.target.checked)} />
                    <label>¿Tiene Regaderas?</label>
                    <input type="checkbox" checked={tiene_regaderas} onChange={(e) => setRegaderas(e.target.checked)} />
                    <label>¿Hay Tiene Médico?</label>
                    <input type="checkbox" checked={tiene_medico} onChange={(e) => setMedico(e.target.checked)} />
                                
                </div>
                <button type="submit" className="btn btn-primary">Crear Deportivo</button>
            </form>
        </div>
    );
}

export default CompCreateDeportivo;

