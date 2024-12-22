import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const URI = 'http://localhost:8000/oneEncargado/';
const updURI = 'http://localhost:8000/updateEncargado/';

const CompEditEncargado = () => {
    const navigate = useNavigate();
    const { ID_Encargado } = useParams();
    const [Nombre, setNombre] = useState('');
    const [Primer_Apellido, setPrimerApellido] = useState('');
    const [Segundo_Apellido, setSegundoApellido] = useState('');
    const [Telefono_Fijo, setTelefonoFijo] = useState('');
    const [Telefono_Movil, setTelefonoMovil] = useState('');
    const [Cargo, setCargo] = useState('');
    const [RFC_CURP, setRFCCURP] = useState('');
    const [Contraseña, setContraseña] = useState('');
    const [formErrors, setFormErrors] = useState({
        Nombre: '',
        Primer_Apellido: '',
        Segundo_Apellido: '',
        Telefono_Fijo: '',
        Telefono_Movil: '',
        Cargo: '',
        RFC_CURP: '',
        Contraseña: ''
    });
    
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

    const update = async (e) => {
        e.preventDefault();

        // Validar Telefonos
        if (!isValidFijo(Telefono_Fijo)) {
            showErrorAlert("El telefono fijo no tiene el formato correcto");
            return;
        }

        if (!isValidMovil(Telefono_Movil)) {
            showErrorAlert("El telefono movil no tiene el formato correcto");
            return;
        }

        if (!isValidCURPorRFC(RFC_CURP)) {
            showErrorAlert("El RFC tiene formato inapropiado");
            return;
        }        

        const isValid = validateForm();
        if (isValid) {
            await axios.put(updURI + ID_Encargado, {
                Nombre: Nombre,
                Primer_Apellido: Primer_Apellido,
                Segundo_Apellido: Segundo_Apellido,
                Telefono_Fijo: Telefono_Fijo,
                Telefono_Movil: Telefono_Movil,
                Cargo: Cargo,
                RFC_CURP: RFC_CURP,
                Contraseña: Contraseña
            });
            showSuccessAlert("Encargado editado")
            navigate('/showDeportivos/admin/null');
        }
    };

    const validateForm = () => {
        let valid = true;
        const errors = {
            Nombre: '',
            Primer_Apellido: '',
            Segundo_Apellido: '',
            Telefono_Fijo: '',
            Telefono_Movil: '',
            Cargo: '',
            RFC_CURP: '',
            Contraseña: ''
        };

        if (!Nombre.trim()) {
            errors.Nombre = 'El nombre es requerido';
            valid = false;
        }

        else if(contieneNumeros(Nombre)){
            errors.Nombre = 'El nombre no debe tener números';
            valid = false;
        }

        if (!Primer_Apellido.trim()) {
            errors.Primer_Apellido = 'El primer apellido es requerido';
            valid = false;
        }

        else if(contieneNumeros(Primer_Apellido)){
            errors.Primer_Apellido = 'El Primer Apellido no debe tener números';
            valid = false;
        }

        if(contieneNumeros(Segundo_Apellido)){
            errors.Segundo_Apellido = 'El Segundo Apellido no debe tener números';
            valid = false;
        }

        if (!Telefono_Fijo.trim()) {
            errors.Telefono_Fijo = 'El teléfono fijo es requerido';
            valid = false;
        }
        if (!Telefono_Movil.trim()) {
            errors.Telefono_Movil = 'El teléfono móvil es requerido';
            valid = false;
        }
        if (!Cargo.trim()) {
            errors.Cargo = 'El cargo es requerido';
            valid = false;
        }
        if (!RFC_CURP.trim()) {
            errors.RFC_CURP = 'El RFC/CURP es requerido';
            valid = false;
        } else if (RFC_CURP.length < 13) {
            errors.RFC_CURP = 'El RFC/CURP debe tener 18 caracteres';
            valid = false;
        }
        if (!Contraseña.trim()) {
            errors.Contraseña = 'La contraseña es requerida';
            valid = false;
        }
        if(Telefono_Fijo.length < 10){
            errors.Telefono_Fijo = 'El Telefono Fijo debe tener minimo 10 numeros'
            valid = false;
        }
        if(Telefono_Movil.length < 10){
            errors.Telefono_Movil = 'El Telefono movil debe tener minimo 10 numeros'
            valid = false;
        }
        setFormErrors(errors);
        return valid;
    };

    const isValidFijo = (Numero) => {
        const regex = /^\d+$/;
        return regex.test(Numero);
    };

    const isValidMovil = (Numero) => {
        const regex = /^\d+$/;
        return regex.test(Numero);
    };

    const isValidCURPorRFC = (str) => {
        
        const rfc = /^[A-Z]{4}[0-9]{6}[A-Z0-9]{3}$/;
        if(rfc.test(str)){
            return true
        } 
        else {
            return false
        }
 
    };

    const contieneNumeros = (TokenNombre) => {
        return TokenNombre.match(/\d/) !== null;
    };

    const getEncargadoById = async () => {
        const res = await axios.get(URI + ID_Encargado);
        try {
            setNombre(res.data.Nombre || '');
            setPrimerApellido(res.data.Primer_Apellido || '');
            setSegundoApellido(res.data.Segundo_Apellido || '');
            setTelefonoFijo(res.data.Telefono_Fijo || '');
            setTelefonoMovil(res.data.Telefono_Movil || '');
            setCargo(res.data.Cargo || '');
            setRFCCURP(res.data.RFC_CURP || '');
            setContraseña(res.data.Contraseña || '');
        } catch (error) {
            console.log("Error al obtener datos", error);
        }
    };

    useEffect(() => {
        getEncargadoById();
    }, []);

    return (
        <div className="formulario">
            <h1>Editar encargado existente</h1>
            <form onSubmit={update}>
                <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" value={Nombre} onChange={(e) => setNombre(e.target.value)} className={`form-control ${formErrors.Nombre && 'is-invalid'}`} maxLength={20} />
                    {formErrors.Nombre && <div className="invalid-feedback">{formErrors.Nombre}</div>}
                </div>
                <div className="form-group">
                    <label>Primer Apellido</label>
                    <input type="text" value={Primer_Apellido} onChange={(e) => setPrimerApellido(e.target.value)} className={`form-control ${formErrors.Primer_Apellido && 'is-invalid'}`} maxLength={20}/>
                    {formErrors.Primer_Apellido && <div className="invalid-feedback">{formErrors.Primer_Apellido}</div>}
                </div>
                <div className="form-group">
                    <label>Segundo Apellido</label>
                    <input type="text" value={Segundo_Apellido} onChange={(e) => setSegundoApellido(e.target.value)} className={`form-control ${formErrors.Segundo_Apellido && 'is-invalid'}`} />
                    {formErrors.Segundo_Apellido && <div className="invalid-feedback">{formErrors.Segundo_Apellido}</div>}
                </div>
                <div className="form-group">
                    <label>Teléfono Fijo</label>
                    <input type="text" value={Telefono_Fijo} onChange={(e) => setTelefonoFijo(e.target.value)} className={`form-control ${formErrors.Telefono_Fijo && 'is-invalid'}`} maxLength={11}/>
                    {formErrors.Telefono_Fijo && <div className="invalid-feedback">{formErrors.Telefono_Fijo}</div>}
                </div>
                <div className="form-group">
                    <label>Teléfono Móvil</label>
                    <input type="text" value={Telefono_Movil} onChange={(e) => setTelefonoMovil(e.target.value)} className={`form-control ${formErrors.Telefono_Movil && 'is-invalid'}`} maxLength={11} />
                    {formErrors.Telefono_Movil && <div className="invalid-feedback">{formErrors.Telefono_Movil}</div>}
                </div>
                <div className="form-group">
                    <label>Cargo</label>
                    <input type="text" value={Cargo} onChange={(e) => setCargo(e.target.value)} className={`form-control ${formErrors.Cargo && 'is-invalid'}`} />
                    {formErrors.Cargo && <div className="invalid-feedback">{formErrors.Cargo}</div>}
                </div>
                <div className="form-group">
                    <label>RFC</label>
                    <input type="text" value={RFC_CURP} onChange={(e) => setRFCCURP(e.target.value)} className={`form-control ${formErrors.RFC_CURP && 'is-invalid'}`} maxLength={13} />
                    {formErrors.RFC_CURP && <div className="invalid-feedback">{formErrors.RFC_CURP}</div>}
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input type="password" value={Contraseña} onChange={(e) => setContraseña(e.target.value)} className={`form-control ${formErrors.Contraseña && 'is-invalid'}`} />
                    {formErrors.Contraseña && <div className="invalid-feedback">{formErrors.Contraseña}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Actualizar encargado</button>
            </form>
        </div>
    );
}

export default CompEditEncargado;

