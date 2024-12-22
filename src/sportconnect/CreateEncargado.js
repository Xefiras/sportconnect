import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const URI = "http://localhost:8080/api/encargados/guardarEncargado";

const CompCreateEncargado = () => {
    const navigate = useNavigate();
    const { deportivo_id } = useParams(); // Recibir el ID del deportivo
    const [encargado, setEncargado] = useState({
        nombre: "",
        primerApellido: "",
        segundoApellido: "",
        telefonoFijo: "",
        telefonoMovil: "",
        cargo: "",
        rfcCurp: "",
        contrasena: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEncargado({
            ...encargado,
            [name]: value,
        });
    };

    const store = async (e) => {
        e.preventDefault();

        try {
            const encargadoData = {
                ...encargado,
                deportivo: {
                    idDeportivo: parseInt(deportivo_id), // Relación con el ID del deportivo
                },
            };

            console.log("Datos enviados al backend:", encargadoData);

            const response = await axios.post(URI, encargadoData);
            if (response.status === 201) {
                Swal.fire("Éxito", "El encargado fue creado correctamente.", "success");
                navigate(`/showDeportivos/admin/null`); // Redirigir a la página de éxito (puedes cambiar la ruta)
            }
        } catch (error) {
            console.error("Error al crear el encargado:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un error al crear el encargado. Inténtalo de nuevo.",
            });
        }
    };

    return (
        <div className="formulario">
            <h1>Crear Encargado</h1>
            <form onSubmit={store}>
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        value={encargado.nombre}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Primer Apellido</label>
                    <input
                        type="text"
                        name="primerApellido"
                        value={encargado.primerApellido}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Segundo Apellido</label>
                    <input
                        type="text"
                        name="segundoApellido"
                        value={encargado.segundoApellido}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Teléfono Fijo</label>
                    <input
                        type="text"
                        name="telefonoFijo"
                        value={encargado.telefonoFijo}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Teléfono Móvil</label>
                    <input
                        type="text"
                        name="telefonoMovil"
                        value={encargado.telefonoMovil}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Cargo</label>
                    <input
                        type="text"
                        name="cargo"
                        value={encargado.cargo}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>RFC</label>
                    <input
                        type="text"
                        name="rfcCurp"
                        value={encargado.rfcCurp}
                        onChange={handleChange}
                        className="form-control"
                        maxLength={13} // Limita el número máximo de caracteres a 13
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        name="contrasena"
                        value={encargado.contrasena}
                        onChange={handleChange}
                        className={`form-control ${encargado.contrasena.length > 0 && encargado.contrasena.length < 8 ? 'is-invalid' : ''}`}
                        minLength={8} // Limita la longitud mínima a 8 caracteres
                        required
                    />
                    {encargado.contrasena.length > 0 && encargado.contrasena.length < 8 && (
                        <div className="invalid-feedback">
                            La contraseña debe tener al menos 8 caracteres.
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary">
                    Crear Encargado
                </button>
            </form>
        </div>
    );
};

export default CompCreateEncargado;
