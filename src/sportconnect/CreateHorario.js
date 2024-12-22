import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const URI = "http://localhost:8080/api/horarios/guardarHorario";

const CompCreateHorario = () => {
    const navigate = useNavigate();
    const { deportivo_id } = useParams();
    const [horarios, setHorarios] = useState([
        { dia_semana: "Lunes", hora_apertura: "", hora_cierre: "", inhabil: false },
        { dia_semana: "Martes", hora_apertura: "", hora_cierre: "", inhabil: false },
        { dia_semana: "Miércoles", hora_apertura: "", hora_cierre: "", inhabil: false },
        { dia_semana: "Jueves", hora_apertura: "", hora_cierre: "", inhabil: false },
        { dia_semana: "Viernes", hora_apertura: "", hora_cierre: "", inhabil: false },
        { dia_semana: "Sábado", hora_apertura: "", hora_cierre: "", inhabil: false },
        { dia_semana: "Domingo", hora_apertura: "", hora_cierre: "", inhabil: false }
    ]);

    const store = async (e) => {
        e.preventDefault();
        try {
            // Validación de horas
            const isValid = horarios.every((horario) =>
                isValidHoras(horario.hora_apertura, horario.hora_cierre, horario.inhabil)
            );

            if (!isValid) {
                showErrorAlert("La hora de apertura no puede ser mayor que la de cierre, ni ambas deben ser iguales.");
                return;
            }

            // Formatear los horarios para enviar al backend
            const formattedHorarios = horarios.map((horario) => ({
                diaSemana: horario.dia_semana,
                horaApertura: horario.inhabil ? null : horario.hora_apertura,
                horaCierre: horario.inhabil ? null : horario.hora_cierre,
                inhabil: horario.inhabil,
                deportivo: {
                    idDeportivo: parseInt(deportivo_id) // Relación con el ID del deportivo
                }
            }));

            console.log("Datos enviados al backend:", formattedHorarios);

            // Enviar datos al backend
            await axios.post(URI, formattedHorarios);
            Swal.fire("Éxito", "Los horarios fueron creados correctamente.", "success");
            navigate(`/createEncargado/${deportivo_id}`);
        } catch (error) {
            console.error("Error al crear los horarios:", error);
            showErrorAlert("Hubo un error al crear los horarios. Inténtalo de nuevo.");
        }
    };

    const showErrorAlert = (message) => {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: message,
            confirmButtonText: "OK"
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
        if (updatedHorarios[index].inhabil) {
            updatedHorarios[index].hora_apertura = "";
            updatedHorarios[index].hora_cierre = "";
        }
        setHorarios(updatedHorarios);
    };

    const isValidHoras = (hora_apertura, hora_cierre, inhabil) => {
        if (inhabil) return true;

        if (hora_apertura === hora_cierre) return false;

        const aperturaTime = new Date(`2000-01-01T${hora_apertura}`);
        const cierreTime = new Date(`2000-01-01T${hora_cierre}`);
        return aperturaTime < cierreTime;
    };

    return (
        <form onSubmit={store}>
            <div className="formulario">
                <h1>Ingresar Horarios del Deportivo</h1>
                {horarios.map((horario, index) => (
                    <div key={index}>
                        <label>
                            <h3>{horario.dia_semana}</h3>
                        </label>
                        <div>
                            <input
                                type="time"
                                value={horario.hora_apertura}
                                onChange={(e) => handleHorarioChange(index, "hora_apertura", e.target.value)}
                                className="form-control"
                                placeholder="Hora de apertura"
                                disabled={horario.inhabil}
                            />
                            <span> a </span>
                            <input
                                type="time"
                                value={horario.hora_cierre}
                                onChange={(e) => handleHorarioChange(index, "hora_cierre", e.target.value)}
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
                <button type="submit" className="btn btn-primary">
                    Crear Horarios
                </button>
            </div>
        </form>
    );
};

export default CompCreateHorario;
