import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const URI = "http://localhost:8080/api/encargados/guardarEncargado";

const CompCreateEncargado = () => {
    const navigate = useNavigate();
    const { deportivo_id } = useParams();
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

    const [rfcError, setRfcError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEncargado({
            ...encargado,
            [name]: value,
        });

        if (name === "rfcCurp") {
            validateRfc(value);
        }
    };

    const validateRfc = (rfc) => {
        const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i;
        if (!rfcRegex.test(rfc)) {
            setRfcError("El RFC no es válido. Asegúrate de que tenga el formato correcto.");
        } else {
            setRfcError("");
        }
    };

    const store = async (e) => {
        e.preventDefault();

        if (rfcError) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Por favor, corrige los errores en el formulario antes de enviarlo.",
            });
            return;
        }

        try {
            const encargadoData = {
                ...encargado,
                deportivo: {
                    idDeportivo: parseInt(deportivo_id),
                },
            };

            console.log("Datos enviados al backend:", encargadoData);

            const response = await axios.post(URI, encargadoData);
            if (response.status === 201) {
                Swal.fire("Éxito", "El encargado fue creado correctamente.", "success");
                navigate(`/showDeportivos/admin/null`);
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
                        value={encargado.rfcCurp.toUpperCase()} // Convertir automáticamente a mayúsculas
                        onChange={(e) => {
                            const value = e.target.value.toUpperCase(); // Forzar mayúsculas
                            setEncargado({ ...encargado, rfcCurp: value });
                            validateRfc(value); // Validar RFC
                        }}
                        className={`form-control ${rfcError ? "is-invalid" : ""}`} // Mostrar error si no cumple el formato
                        maxLength={13} // RFC estándar tiene 13 caracteres
                        required
                    />
                    {rfcError && <div className="invalid-feedback">{rfcError}</div>}
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        name="contrasena"
                        value={encargado.contrasena}
                        onChange={handleChange}
                        className={`form-control ${
                            encargado.contrasena.length > 0 && encargado.contrasena.length < 8 ? "is-invalid" : ""
                        }`}
                        minLength={8}
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
