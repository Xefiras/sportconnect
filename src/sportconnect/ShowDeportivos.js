import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import GoogleMap from './ShowMap';
import Swal from 'sweetalert2';


const URI = 'http://localhost:8080/api/';

const CompShowDeportivos = () => {
    const {userType,RFC_CURP} = useParams();
    console.log(RFC_CURP) //debe tener el mismo nombre de la variable que se pasa desde el componente anterior

    console.log(userType)
    const navigate = useNavigate();
    const [deportivos, setDeportivos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    useEffect(() => {
        if (RFC_CURP!="null") {
            getDeportivoInfoDeEncargado();  // Llama a la función solo si hay un RFC
        } else {        
            getDeportivoInfo(); //Si no, le muestra todo al admin
        }
    }, []);

    useEffect(() => {
        // Aplicar el filtro solo si searchTerm no está vacío
        if (searchTerm.trim() !== '') {
            const filteredDeportivos = searchDeportivos(searchTerm);
            setDeportivos(filteredDeportivos);
        } else {
            // Si searchTerm está vacío, mostrar todos los deportivos
            if (RFC_CURP !== "null") {
                getDeportivoInfoDeEncargado();
            } else {
                getDeportivoInfo();
            }
        }
    }, [searchTerm]);

    // Función para formatear fecha a "DD/MM/YYYY"
    const formatDateToNormal = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const searchDeportivos = (term) => {
        // Si el término de búsqueda está vacío, mostrar todos los deportivos
        if (!term.trim()) {
            return deportivos;
        }
    
        // Filtrar los deportivos según el término de búsqueda
        const filteredDeportivos = deportivos.filter((deportivo) => {
            const nombreLower = deportivo.Nombre.toLowerCase();
            const numeroRegistroStr = deportivo.numero_registro.toString().toLowerCase();
            const termLower = term.toLowerCase();
    
            // Comprobar si el nombre o el número de registro incluyen el término de búsqueda
            return nombreLower.includes(termLower) || numeroRegistroStr.includes(termLower);
        });
    
        return filteredDeportivos;
    };
    
    

    const getDeportivoInfo = async () => {
        const res = await axios.get(`${URI}deportivos/obtenerDeportivos`);
        setDeportivos(res.data);
        console.log(res.data)
    }

    const getDeportivoInfoDeEncargado = async () => {
        console.log("rfc", RFC_CURP)
        const res = await axios.get(`${URI}deportivos/getDeportivoByEncargado/${RFC_CURP}`, {
        });
        setDeportivos(res.data);
    }    

    const deleteDeportivoInfo = async (id) => {
        await axios.delete(`${URI}deportivos/deleteDeportivo?idDeportivo=${id}`);
        getDeportivoInfo();
    }

    const deleteCancha = async (ID_Cancha) => {
        await axios.delete(`${URI}deleteCancha/${ID_Cancha}`);
        getDeportivoInfoDeEncargado(); //Volvemos a las canchas pertenecientes al encargado
    }

    const [expandedDeportivo, setExpandedDeportivo] = useState(null);
    const [expandedSubAccordion, setExpandedSubAccordion] = useState(null);

    //Creamos constante para esconder los divs dependiendo del tipo de usuario
    const shouldShowDiv = userType === "enc"; //Esconde funciones (div) para el admin
    const shouldHideDiv = userType === "admin"; //Esconde funciones (div) para el encargado, como modificar la direccion
    console.log("should?",shouldShowDiv)
    
    const toggleAccordion = (idDeportivo) => {
        setExpandedDeportivo(idDeportivo === expandedDeportivo ? null : idDeportivo);
    };

    const toggleSubAccordion = (index) => {
        setExpandedSubAccordion(index === expandedSubAccordion ? null : index);
    };

    const handleDeleteDeportivo = (idDeportivo) => {
        // Mostrar un mensaje de confirmación utilizando SweetAlert
        Swal.fire({
            title: '¿Estás seguro de eliminar este deportivo?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    '¡Eliminado!',
                    'El deportivo ha sido eliminado exitosamente.',
                    'success',                    
                );
                deleteDeportivoInfo(idDeportivo)            
            }
        });
    }

    const handleDelete = (ID_Cancha) => {
        // Mostrar un mensaje de confirmación utilizando SweetAlert
        Swal.fire({
            title: '¿Estás seguro de eliminar esta cancha?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    '¡Eliminado!',
                    'La cancha ha sido eliminado exitosamente.',
                    'success',                    
                );
                deleteCancha(ID_Cancha)            
            }
        });
    };

    const handleCerrarSesion = (RFC_CURP) => {
        // Mostrar un mensaje de confirmación utilizando SweetAlert
        Swal.fire({
            title: 'Cerrar Sesión',
            text: '¿Estás seguro de cerrar sesión?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, nos vemos',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {                
                Swal.fire(
                    '¡Hasta Luego!',
                    RFC_CURP,
                    'success',                    
                );
                navigate('/', { replace: true }); //Reemplazamos el historial
            }
        });
    }

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
        <div className="deportivos-accordion">
            <input
                type="text"
                className="search-bar"
                placeholder="Buscar deportivo por nombre o folio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {shouldHideDiv && (
                <Link to="/createDeportivo" className="btn btn-primary mt-2 mtb-2">
                    <i className="fa-solid fa-plus"></i> Agregar nuevo deportivo
                </Link>
            )}
            <button onClick={handleCerrarSesion} className="btn btn-danger mt-2 mtb-2">
                <i className="fa fa-sign-out" aria-hidden="true"></i> Cerrar Sesión
            </button>
            {deportivos.map((deportivo) => {
                let lat = 0;
                let lng = 0;
                if (deportivo.direccion && deportivo.direccion.coords) {
                    [lat, lng] = deportivo.direccion.coords.split(',').map(parseFloat);
                }
    
                return (
                    <div key={deportivo.idDeportivo} className="deportivo-card">
                        <div className="accordion-header" onClick={() => toggleAccordion(deportivo.idDeportivo)}>
                            <h2>
                                {deportivo.numero_registro} - {deportivo.nombre}
                            </h2>
                            <span>{expandedDeportivo === deportivo.idDeportivo ? '-' : '+'}</span>
                        </div>
                        {expandedDeportivo === deportivo.idDeportivo && (
                            <div className="accordion-content">
                                <h2>Servicios</h2>
                                <p>
                                    <strong>Acepta Mascotas:</strong> {deportivo.acepta_mascotas ? 'Sí' : 'No'}
                                    <strong> - Tienda:</strong> {deportivo.tiene_tienda ? 'Sí' : 'No'}
                                    <strong> - Vestidores:</strong> {deportivo.tiene_vestidores ? 'Sí' : 'No'}
                                    <strong> - Regaderas:</strong> {deportivo.tiene_regaderas ? 'Sí' : 'No'}
                                    <strong> - Médico:</strong> {deportivo.tiene_medico ? 'Sí' : 'No'}
                                </p>
                                {shouldHideDiv && (
                                    <div>
                                        <Link
                                            to={`/editDeportivo/${deportivo.idDeportivo}`}
                                            className="btn btn-info"
                                        >
                                            <i className="fa-regular fa-pen-to-square"></i> Editar Servicios
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteDeportivo(deportivo.idDeportivo)}
                                            className="btn btn-danger"
                                        >
                                            <i className="fa-solid fa-trash"></i> Eliminar Deportivo
                                        </button>
                                    </div>
                                )}
    
                                {deportivo.direccion && (
                                    <div className="sub-accordion">
                                        <h3 onClick={() => toggleSubAccordion(0)}>Dirección</h3>
                                        {expandedSubAccordion === 0 && (
                                            <div className="sub-accordion-content">
                                                <p><strong>Calle:</strong> {deportivo.direccion.calle}</p>
                                                <p><strong>Alcaldía:</strong> {deportivo.direccion.alcaldia}</p>
                                                <p><strong>Código Postal:</strong> {deportivo.direccion.codigoPostal}</p>
                                                <p><strong>Referencias:</strong> {deportivo.direccion.referencias}</p>
                                                <p><strong>Entre Calle 1:</strong> {deportivo.direccion.entre_calle1}</p>
                                                <p><strong>Entre Calle 2:</strong> {deportivo.direccion.entre_calle2}</p>
                                                <GoogleMap coordinates={{ lat, lng }} />
                                                {shouldHideDiv && (
                                                    <Link
                                                        to={`/editDireccion/${deportivo.direccion.idDireccion}`}
                                                        className="btn btn-info"
                                                    >
                                                        <i className="fa-regular fa-pen-to-square"></i> Editar Dirección
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
    
                                <div className="sub-accordion">
                                <h3 onClick={() => toggleSubAccordion(2)}>Canchas</h3>
                                {expandedSubAccordion === 2 && (
                                    <div className="sub-accordion-content">
                                        {shouldShowDiv && (
                                        <Link
                                            to={`/createCancha/${deportivo.idDeportivo}/coords/${RFC_CURP}`}
                                            className="btn btn-primary mb-3"
                                        >
                                            <i className="fa-solid fa-plus"></i> Crear Cancha
                                        </Link>
                                        )}
                                        {deportivo.canchas && deportivo.canchas.length > 0 ? (
                                            deportivo.canchas.map((cancha) => {
                                                let latCancha = 0;
                                                let lngCancha = 0;
                                                if (cancha.coordenadas_cancha) {
                                                    [latCancha, lngCancha] = cancha.coordenadas_cancha.split(',').map(parseFloat);
                                                }
                                                return (
                                                    <div key={cancha.id_cancha} className="cancha-info">
                                                        <p><strong>Tipo:</strong> {cancha.tipo_cancha}</p>
                                                        <p><strong>Número:</strong> {cancha.numero_cancha}</p>
                                                        <p><strong>Material del Piso:</strong> {cancha.material_piso}</p>
                                                        <p><strong>Techado:</strong> {cancha.tiene_techo ? 'Sí' : 'No'}</p>
                                                        <p><strong>Gradas:</strong> {cancha.tiene_gradas ? 'Sí' : 'No'}</p>
                                                        <p><strong>Capacidad:</strong> {cancha.capacidad_jugadores}</p>
                                                        <p><strong>Estado:</strong> {cancha.estado}</p>
                                                        <GoogleMap
                                                            coordinates={{ lat: latCancha, lng: lngCancha }}
                                                            style={{ height: '200px', width: '100%' }} // Limitar altura y ancho del mapa
                                                        />
                                                        {shouldShowDiv && (
                                                            <div className="button-container mt-3">
                                                                <Link
                                                                    to={`/editCancha/${cancha.id_cancha}/${deportivo.idDeportivo}/${RFC_CURP}`}
                                                                    className="btn btn-info"
                                                                >
                                                                    <i className="fa-regular fa-pen-to-square"></i> Editar Cancha
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(cancha.id_cancha)}
                                                                    className="btn btn-danger ml-2"
                                                                >
                                                                    <i className="fa-solid fa-trash"></i> Eliminar Cancha
                                                                </button>
                                                            </div>
                                                        )}
                                                        {/* Mostrar mejoras debajo de la cancha */}
                                                        <div className="mejoras mt-4">
                                                            <h4>Mejoras</h4>
                                                            {cancha.mejoras && cancha.mejoras.length > 0 ? (
                                                                <div className="mejoras-grid">
                                                                    {cancha.mejoras.map((mejora) => (
                                                                        <div key={mejora.id_mejora} className="card mejora-card">
                                                                            <div className="card-body">
                                                                                <h5 className="card-title">{mejora.nombre_mejora}</h5>
                                                                                <p className="card-text">
                                                                                    <strong>Descripción:</strong> {mejora.descripcion_mejora}
                                                                                </p>
                                                                                <p className="card-text">
                                                                                    <strong>Justificación:</strong> {mejora.justificacion_mejora}
                                                                                </p>
                                                                                <p className="card-text">
                                                                                    <strong>Fecha de Implementación:</strong> {formatDateToNormal(mejora.fecha_implementacion)}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p>No hay mejoras registradas para esta cancha.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p>No existen canchas registradas.</p>
                                        )}

                                    </div>
                                )}
                            </div>

    
                            {deportivo.encargado && (
                                <div className="sub-accordion">
                                    <h3 onClick={() => toggleSubAccordion(3)}>Encargado</h3>
                                    {expandedSubAccordion === 3 && (
                                        <div className="sub-accordion-content">
                                            <p><strong>Nombre:</strong> {deportivo.encargado.nombre}</p>
                                            <p><strong>Primer Apellido:</strong> {deportivo.encargado.primerApellido}</p>
                                            <p><strong>Segundo Apellido:</strong> {deportivo.encargado.segundoApellido}</p>
                                            <p><strong>Teléfono Fijo:</strong> {deportivo.encargado.telefonoFijo}</p>
                                            <p><strong>Teléfono Móvil:</strong> {deportivo.encargado.telefonoMovil}</p>
                                            <p><strong>Cargo:</strong> {deportivo.encargado.cargo}</p>
                                            <p><strong>RFC/Curp:</strong> {deportivo.encargado.rfcCurp}</p>

                                            {/* Sección de Contraseña */}
                                            <p>
                                                <strong>Contraseña:</strong>{" "}
                                                {showPassword ? deportivo.encargado.contrasena : "********"}
                                            </p>
                                            <button
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="btn btn-warning mt-3"
                                            >
                                                {showPassword ? "Ocultar Contraseña" : "Mostrar Contraseña"}
                                            </button>

                                            <Link
                                                to={`/editEncargado/${deportivo.encargado.idEncargado}`}
                                                className="btn btn-info mt-3"
                                            >
                                                Editar Encargado
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
    
    
    
}    
export default CompShowDeportivos;