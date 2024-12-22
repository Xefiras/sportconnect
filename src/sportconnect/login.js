import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css'; // Importa el archivo CSS
import Swal from 'sweetalert2';


const URI = 'http://localhost:8080/api/encargados/login';

const CompLogin = () => {
    // Estados para RFC, contrasena y mensajes de error
    const [rfcCurp, setRfc] = useState('');
    const [contrasena, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Hook para navegar a otra ruta después de iniciar sesión
    const navigate = useNavigate();

    const showErrorAlert = (message) => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            confirmButtonText: 'OK'
        });
    };
    
    // Función para manejar el formulario de login
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Realiza una solicitud POST al backend con RFC y contrasena
            const response = await axios.post(URI, { rfcCurp, contrasena });

            // Si el inicio de sesión es exitoso (status 200), redirige a /showDeportivos si es admin (status 201, tomamos medidas)
            console.log("status", response.status)

            if (response.status === 201) {
                Swal.fire(
                    '¡Bienvenido!',
                    'Administrador',
                    'success',                    
                );
                navigate('/showDeportivos/admin/null');
            }                 
            else if (response.status === 200) {
                Swal.fire(
                    '¡Bienvenido! Encargado',
                    rfcCurp,
                    'success',                    
                );
                navigate(`/showDeportivos/enc/${rfcCurp}`);
            } else if(response.status === 401) {
                // Si el servidor devuelve un error, muestra un mensaje
                showErrorAlert('Credenciales incorrectas');
            }
        } catch (error) {
            // Manejo de errores
            showErrorAlert('Credenciales incorrectas');
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">LOGIN</h2>
            {/* Muestra un mensaje de error si hay */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label htmlFor="rfcCurp">RFC:</label>
                    <input
                        type="text"
                        id="rfcCurp"
                        value={rfcCurp}
                        onChange={(e) => setRfc(e.target.value)}
                        required
                        className="input-field"
                        maxLength={13} 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="contrasena">contrasena:</label>
                    <input
                        type="password"
                        id="contrasena"
                        value={contrasena}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-field"
                    />
                </div>
                <button type="submit" className="submit-button">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default CompLogin;
