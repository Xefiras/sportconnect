import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const URI = 'http://localhost:8080/api/deportivos/obtenerDeportivo';
const updURI = 'http://localhost:8080/api/deportivos/updateDeportivo';
const URICNRE = 'http://localhost:8080/api/deportivos/obtenerDeportivos';

const CompEditDeportivo = () => {
    const navigate = useNavigate();
    const { ID_Deportivo } = useParams();

    // Estado para los datos del deportivo
    const [numero_registro, setNumeroRegistro] = useState('');
    const [nombre, setNombre] = useState('');
    const [acepta_mascotas, setAceptaMascotas] = useState(false);
    const [tiene_tienda, setTienda] = useState(false);
    const [tiene_vestidores, setVestidores] = useState(false);
    const [tiene_regaderas, setRegaderas] = useState(false);
    const [tiene_medico, setMedico] = useState(false);

    const [formErrors, setFormErrors] = useState({
        nombre: '',
        numero_registro: ''
    });

    // Verificar si el número de registro ya existe
    const checkNumeroRegistroExistente = async () => {
        try {
            const response = await axios.get(URICNRE);
            const deportivos = response.data;

            const numeroRegistroExistente = deportivos.find(deportivo => (
                parseInt(deportivo.numero_registro) === parseInt(numero_registro) &&
                parseInt(deportivo.idDeportivo) !== parseInt(ID_Deportivo)
            ));

            return numeroRegistroExistente !== undefined;
        } catch (error) {
            console.error('Error al verificar la existencia del número de registro:', error);
        }
    };

    // Actualizar el deportivo
    const update = async (e) => {
        e.preventDefault();

        const numeroRegistroExistente = await checkNumeroRegistroExistente();

        if (numeroRegistroExistente) {
            showErrorAlert("Ya existe un deportivo con ese número de registro");
            return;
        }

        const isValid = validateForm();
        if (isValid) {
            try {
                const payload = {
                    idDeportivo: parseInt(ID_Deportivo),
                    nombre,
                    numero_registro: parseInt(numero_registro),
                    acepta_mascotas,
                    tiene_tienda,
                    tiene_vestidores,
                    tiene_regaderas,
                    tiene_medico
                };

                const response = await axios.put(updURI, payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 200) {
                    showSuccessAlert("Información básica del deportivo actualizada con éxito");
                    navigate('/showDeportivos/admin/null');
                }
            } catch (error) {
                console.error("Error al actualizar el deportivo:", error);
                showErrorAlert("Error al actualizar el deportivo");
            }
        }
    };

    // Obtener los datos del deportivo
    const getDeportivoById = async () => {
        try {
            const res = await axios.get(`${URI}?idDeportivo=${ID_Deportivo}`);
            const data = res.data;

            // Asignar los valores recuperados al estado
            setNombre(data.nombre || '');
            setNumeroRegistro(data.numero_registro || '');
            setAceptaMascotas(data.acepta_mascotas || false);
            setTienda(data.tiene_tienda || false);
            setVestidores(data.tiene_vestidores || false);
            setRegaderas(data.tiene_regaderas || false);
            setMedico(data.tiene_medico || false);
        } catch (error) {
            console.error("Error al obtener los datos del deportivo:", error);
            showErrorAlert("Error al obtener datos del deportivo");
        }
    };

    useEffect(() => {
        getDeportivoById();
    }, []);

    // Mostrar alertas de error
    const showErrorAlert = (message) => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            confirmButtonText: 'OK'
        });
    };

    // Mostrar alertas de éxito
    const showSuccessAlert = (message) => {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: message,
            confirmButtonText: 'OK'
        });
    };

    // Validar el formulario
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
            <h1>Editar Deportivo</h1>
            <form onSubmit={update}>
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className={`form-control ${formErrors.nombre && 'is-invalid'}`}
                    />
                    {formErrors.nombre && <div className="invalid-feedback">{formErrors.nombre}</div>}
                </div>
                <div className="form-group">
                    <label>Número de Registro</label>
                    <input
                        type="text"
                        value={numero_registro}
                        onChange={(e) => setNumeroRegistro(e.target.value)}
                        className={`form-control ${formErrors.numero_registro && 'is-invalid'}`}
                        maxLength={6}
                    />
                    {formErrors.numero_registro && <div className="invalid-feedback">{formErrors.numero_registro}</div>}
                </div>
                <div className="form-group">
                    <label>¿Acepta Mascotas?</label>
                    <input
                        type="checkbox"
                        checked={acepta_mascotas}
                        onChange={(e) => setAceptaMascotas(e.target.checked)}
                    />
                    <label>¿Tiene Tienda?</label>
                    <input
                        type="checkbox"
                        checked={tiene_tienda}
                        onChange={(e) => setTienda(e.target.checked)}
                    />
                    <label>¿Tiene Vestidores?</label>
                    <input
                        type="checkbox"
                        checked={tiene_vestidores}
                        onChange={(e) => setVestidores(e.target.checked)}
                    />
                    <label>¿Tiene Regaderas?</label>
                    <input
                        type="checkbox"
                        checked={tiene_regaderas}
                        onChange={(e) => setRegaderas(e.target.checked)}
                    />
                    <label>¿Hay Médico?</label>
                    <input
                        type="checkbox"
                        checked={tiene_medico}
                        onChange={(e) => setMedico(e.target.checked)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Actualizar Deportivo</button>
            </form>
        </div>
    );
};

export default CompEditDeportivo;
