import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const URI = "http://localhost:8080/api/encargados/obtenerEncargado/";
const updURI = "http://localhost:8080/api/encargados/updateEncargado";

const CompEditEncargado = () => {
  const navigate = useNavigate();
  const { ID_Encargado } = useParams();

  const [idEncargado, setIdEncargado] = useState("");
  const [nombre, setNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
  const [telefonoFijo, setTelefonoFijo] = useState("");
  const [telefonoMovil, setTelefonoMovil] = useState("");
  const [cargo, setCargo] = useState("");
  const [rfcCurp, setRfcCurp] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
      confirmButtonText: "OK",
    });
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: message,
      confirmButtonText: "OK",
    });
  };

  const update = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Enviar datos al backend
      await axios.put(updURI, {
        idEncargado,
        nombre,
        primerApellido,
        segundoApellido,
        telefonoFijo,
        telefonoMovil,
        cargo,
        rfcCurp,
        contrasena,
      });

      showSuccessAlert("Encargado actualizado exitosamente");
      navigate("/showDeportivos/admin/null");
    } catch (error) {
      showErrorAlert("Error al actualizar el encargado");
      console.error("Error:", error.response || error.message);
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
  
    // Validar Nombre
    if (!nombre.trim()) {
      errors.nombre = "El nombre es requerido";
      isValid = false;
    } else if (/\d/.test(nombre)) {
      errors.nombre = "El nombre no debe contener números";
      isValid = false;
    }
  
    // Validar Primer Apellido
    if (!primerApellido.trim()) {
      errors.primerApellido = "El primer apellido es requerido";
      isValid = false;
    } else if (/\d/.test(primerApellido)) {
      errors.primerApellido = "El primer apellido no debe contener números";
      isValid = false;
    }
  
    // Validar Segundo Apellido (opcional)
    if (segundoApellido.trim() && /\d/.test(segundoApellido)) {
      errors.segundoApellido = "El segundo apellido no debe contener números";
      isValid = false;
    }
  
    // Validar Teléfono Fijo
    if (!telefonoFijo.trim()) {
      errors.telefonoFijo = "El teléfono fijo es requerido";
      isValid = false;
    } else if (!/^\d{10}$/.test(telefonoFijo)) {
      errors.telefonoFijo = "El teléfono fijo debe tener exactamente 10 números";
      isValid = false;
    }
  
    // Validar Teléfono Móvil
    if (!telefonoMovil.trim()) {
      errors.telefonoMovil = "El teléfono móvil es requerido";
      isValid = false;
    } else if (!/^\d{10}$/.test(telefonoMovil)) {
      errors.telefonoMovil = "El teléfono móvil debe tener exactamente 10 números";
      isValid = false;
    }
  
    // Validar Cargo
    if (!cargo.trim()) {
      errors.cargo = "El cargo es requerido";
      isValid = false;
    }
  
    // Validar RFC/CURP
    if (!rfcCurp.trim()) {
      errors.rfcCurp = "El RFC/CURP es requerido";
      isValid = false;
    } else if (rfcCurp.length !== 13) {
      errors.rfcCurp = "El RFC/CURP debe tener exactamente 13 caracteres";
      isValid = false;
    }
  
    // Validar Contraseña
    if (!contrasena.trim()) {
      errors.contrasena = "La contraseña es requerida";
      isValid = false;
    } else if (contrasena.length < 8) {
      errors.contrasena = "La contraseña debe tener al menos 8 caracteres";
      isValid = false;
    }
  
    setFormErrors(errors);
    return isValid;
  };  


  const getEncargadoById = async () => {
    try {
      const { data } = await axios.get(`${URI}${ID_Encargado}`);
      setIdEncargado(data.idEncargado || "");
      setNombre(data.nombre || "");
      setPrimerApellido(data.primerApellido || "");
      setSegundoApellido(data.segundoApellido || "");
      setTelefonoFijo(data.telefonoFijo || "");
      setTelefonoMovil(data.telefonoMovil || "");
      setCargo(data.cargo || "");
      setRfcCurp(data.rfcCurp || "");
      setContrasena(data.contrasena || "");
    } catch (error) {
      console.error("Error al obtener los datos del encargado:", error);
      showErrorAlert("Error al cargar la información del encargado");
    }
  };

  useEffect(() => {const validateForm = () => {
    const errors = {};
    let isValid = true;
  
    if (!nombre.trim()) {
      errors.nombre = "El nombre es requerido";
      isValid = false;
    }
    if (!primerApellido.trim()) {
      errors.primerApellido = "El primer apellido es requerido";
      isValid = false;
    }
    if (segundoApellido.trim() && /\d/.test(segundoApellido)) {
      errors.segundoApellido = "El segundo apellido no debe contener números";
      isValid = false;
    }
    if (!telefonoFijo.trim() || telefonoFijo.length < 10) {
      errors.telefonoFijo = "El teléfono fijo debe tener al menos 10 números";
      isValid = false;
    }
    if (!telefonoMovil.trim() || telefonoMovil.length < 10) {
      errors.telefonoMovil = "El teléfono móvil debe tener al menos 10 números";
      isValid = false;
    }
    if (!cargo.trim()) {
      errors.cargo = "El cargo es requerido";
      isValid = false;
    }
    if (!rfcCurp.trim() || rfcCurp.length < 13) {
      errors.rfcCurp = "El RFC/CURP debe tener al menos 13 caracteres";
      isValid = false;
    }
    if (!contrasena.trim()) {
      errors.contrasena = "La contraseña es requerida";
      isValid = false;
    } else if (contrasena.length < 8) {
      errors.contrasena = "La contraseña debe tener al menos 8 caracteres";
      isValid = false;
    }
  
    setFormErrors(errors);
    return isValid;
  };
  
    getEncargadoById();
  }, []);

  return (
    <div className="formulario">
      <h1>Editar encargado existente</h1>
      <form onSubmit={update}>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={`form-control ${formErrors.nombre && "is-invalid"}`}
          />
          {formErrors.nombre && <div className="invalid-feedback">{formErrors.nombre}</div>}
        </div>
        <div className="form-group">
          <label>Primer Apellido</label>
          <input
            type="text"
            value={primerApellido}
            onChange={(e) => setPrimerApellido(e.target.value)}
            className={`form-control ${formErrors.primerApellido && "is-invalid"}`}
          />
          {formErrors.primerApellido && (
            <div className="invalid-feedback">{formErrors.primerApellido}</div>
          )}
        </div>
        <div className="form-group">
          <label>Segundo Apellido</label>
          <input
            type="text"
            value={segundoApellido}
            onChange={(e) => setSegundoApellido(e.target.value)}
            className={`form-control ${formErrors.segundoApellido && "is-invalid"}`}
          />
          {formErrors.segundoApellido && (
            <div className="invalid-feedback">{formErrors.segundoApellido}</div>
          )}
        </div>
        <div className="form-group">
          <label>Teléfono Fijo</label>
          <input
            type="text"
            value={telefonoFijo}
            onChange={(e) => setTelefonoFijo(e.target.value)}
            className={`form-control ${formErrors.telefonoFijo && "is-invalid"}`}
          />
          {formErrors.telefonoFijo && (
            <div className="invalid-feedback">{formErrors.telefonoFijo}</div>
          )}
        </div>
        <div className="form-group">
          <label>Teléfono Móvil</label>
          <input
            type="text"
            value={telefonoMovil}
            onChange={(e) => setTelefonoMovil(e.target.value)}
            className={`form-control ${formErrors.telefonoMovil && "is-invalid"}`}
          />
          {formErrors.telefonoMovil && (
            <div className="invalid-feedback">{formErrors.telefonoMovil}</div>
          )}
        </div>
        <div className="form-group">
          <label>Cargo</label>
          <input
            type="text"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            className={`form-control ${formErrors.cargo && "is-invalid"}`}
          />
          {formErrors.cargo && <div className="invalid-feedback">{formErrors.cargo}</div>}
        </div>
        <div className="form-group">
          <label>RFC</label>
          <input
            type="text"
            value={rfcCurp}
            onChange={(e) => {
              const newValue = e.target.value.toUpperCase();
              setRfcCurp(newValue);
              const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i; // Validar RFC incluyendo homoclave
              if (!rfcRegex.test(newValue)) {
                setFormErrors((prev) => ({
                  ...prev,
                  rfcCurp: "El RFC no es válido. Asegúrate de incluir la homoclave y que cumpla el formato correcto.",
                }));
              } else {
                setFormErrors((prev) => {
                  const { rfcCurp, ...rest } = prev;
                  return rest; // Eliminar error si es válido
                });
              }
            }}
            className={`form-control ${formErrors.rfcCurp ? "is-invalid" : ""}`} // Aplicar clase para error
            maxLength={13} // Limitar a 13 caracteres
            required
          />
          {formErrors.rfcCurp && <div className="invalid-feedback">{formErrors.rfcCurp}</div>}
        </div>
        <div className="form-group">
            <label>Contraseña</label>
            <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className={`form-control ${formErrors.contrasena && "is-invalid"}`}
            />
            {formErrors.contrasena && (
                <div className="invalid-feedback">{formErrors.contrasena}</div>
            )}
            </div>
        <button type="submit" className="btn btn-primary">
          Actualizar encargado
        </button>
      </form>
    </div>
  );
};

export default CompEditEncargado;
