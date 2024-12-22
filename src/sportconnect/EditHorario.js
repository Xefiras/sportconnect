import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const updURI = 'http://localhost:8000/updateHorarios/';
const recURI = 'http://localhost:8000/getHorarioDeportivo/';

const CompEditHorario = () => {
    const navigate = useNavigate();
    const { ID_Deportivo } = useParams();
    const [horarios, setHorarios] = useState([
        { dia_semana: 'Lunes', hora_apertura: '', hora_cierre: '', inhabil: false, ID_Horario: null },
        { dia_semana: 'Martes', hora_apertura: '', hora_cierre: '', inhabil: false, ID_Horario: null },
        { dia_semana: 'Miércoles', hora_apertura: '', hora_cierre: '', inhabil: false, ID_Horario: null },
        { dia_semana: 'Jueves', hora_apertura: '', hora_cierre: '', inhabil: false, ID_Horario: null },
        { dia_semana: 'Viernes', hora_apertura: '', hora_cierre: '', inhabil: false, ID_Horario: null },
        { dia_semana: 'Sábado', hora_apertura: '', hora_cierre: '', inhabil: false, ID_Horario: null },
        { dia_semana: 'Domingo', hora_apertura: '', hora_cierre: '', inhabil: false, ID_Horario: null }
    ]);

    useEffect(() => {
        const fetchHorarios = async () => {
            try {
                const response = await axios.get(`${recURI}${ID_Deportivo}`);
                const horariosData = response.data;

                // Actualizar el estado de horarios con los datos recuperados
                const updatedHorarios = horarios.map((horario, index) => {
                    const horarioData = horariosData[index] || {};
                    return {
                        ...horario,
                        hora_apertura: horarioData.hora_apertura || '',
                        hora_cierre: horarioData.hora_cierre || '',
                        inhabil: horarioData.inhabil || false,
                        ID_Horario: horarioData.ID_Horario || null
                    };
                });

                setHorarios(updatedHorarios);

            } catch (error) {
                console.error('Error al obtener horarios:', error);
                showErrorAlert('Hubo un error al obtener los horarios del deportivo.');
            }
        };

        fetchHorarios(); // Obtener los horarios al cargar el componente
    }, [ID_Deportivo]);

    const update = async (e) => {
        e.preventDefault();
        try {
            const isValid = horarios.every((horario) =>
                isValidHoras(horario.hora_apertura, horario.hora_cierre, horario.inhabil)
            );

            if (!isValid) {
                showErrorAlert("La hora de apertura no puede ser mayor que la de cierre, ni ambas deben ser iguales.");
                return;
            }

            const postData = { horarios };
            await axios.put(updURI, postData);
            showSuccessAlert("Horario Editado")
            navigate(`/showDeportivos/admin/null`);

        } catch (error) {
            console.error("Error:", error);
            showErrorAlert("Hubo un error al actualizar los horarios. Inténtalo de nuevo.");
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

    const showSuccessAlert = (message) => {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: message,
            confirmButtonText: 'OK'
        });
    }; 

    const handleHorarioChange = (index, field, value) => {
        const updatedHorarios = [...horarios];
        updatedHorarios[index][field] = value;
        setHorarios(updatedHorarios);
    };

    const handleInhabilChange = (index) => {
        const updatedHorarios = [...horarios];
        updatedHorarios[index].inhabil = !updatedHorarios[index].inhabil;
        setHorarios(updatedHorarios);
    };

    const isValidHoras = (hora_apertura, hora_cierre, inhabil) => {
        if (inhabil) {
            return true; // No se aplica la validación si está marcado como inhabilitado
        }

        if (hora_apertura === hora_cierre) {
            return false; // Las horas de apertura y cierre no pueden ser iguales
        }

        const aperturaTime = new Date(`2000-01-01T${hora_apertura}`);
        const cierreTime = new Date(`2000-01-01T${hora_cierre}`);

        if (aperturaTime >= cierreTime) {
            return false; // La hora de apertura no puede ser mayor o igual que la hora de cierre
        }

        return true; // Válido en otros casos
    };

    return (
        <form onSubmit={update}>
            <div className="formulario">
                <h1>Editar Horarios del Deportivo</h1>
                {horarios.map((horario, index) => (
                    <div key={index}>
                        <label><h3>{horario.dia_semana}</h3></label>
                        <div>
                            <input
                                type="time"
                                value={horario.hora_apertura}
                                onChange={(e) => handleHorarioChange(index, 'hora_apertura', e.target.value)}
                                className="form-control"
                                placeholder="Hora de apertura"
                                disabled={horario.inhabil}
                            />
                            <span> a </span>
                            <input
                                type="time"
                                value={horario.hora_cierre}
                                onChange={(e) => handleHorarioChange(index, 'hora_cierre', e.target.value)}
                                className="form-control"
                                placeholder="Hora de cierre"
                                disabled={horario.inhabil}
                            />
                            <label>
                                <input
                                    type="checkbox"
                                    checked={horario.inhabil}
                                    onChange={() => handleInhabilChange(index)}
                                />
                                Inhabil
                            </label>
                        </div>
                    </div>
                ))}
                <button type="submit" className="btn btn-primary">Editar Horarios</button>
            </div>
        </form>
    );
};

export default CompEditHorario;
