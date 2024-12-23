/* global google */
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const URI = "http://localhost:8080/api/direcciones/obtenerDireccion"; // URI para obtener dirección
const updURI = "http://localhost:8080/api/direcciones/updateDireccion"; // URI para actualizar dirección
const checkURI = "http://localhost:8080/api/direcciones/checkDireccion"; // URI para verificar duplicados

/* Inicio Funcionamiento de Maps */
const Map = ({ center, zoom, onMapClick, marker }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!map && mapRef.current && window.google) {
      const newMap = new google.maps.Map(mapRef.current, {
        center,
        zoom,
      });

      newMap.addListener("click", (event) => {
        if (onMapClick) {
          onMapClick(event.latLng);
        }
      });

      setMap(newMap);
    } else if (map) {
      map.setCenter(center);
      map.setZoom(zoom);
    }
  }, [mapRef, map, center, zoom, onMapClick]);

  useEffect(() => {
    if (map && marker) {
      if (map.markers) map.markers.forEach((m) => m.setMap(null));
      const newMarker = new google.maps.Marker({
        position: marker,
        map,
      });
      map.markers = [newMarker];
      map.setCenter(marker);
      map.setZoom(18);
    }
  }, [map, marker]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};
/* Fin Funcionamiento de Maps */

const CompEditDireccion = () => {
  const navigate = useNavigate();
  const { ID_Direccion } = useParams(); // Obtener el parámetro de la URL
  const [calle, setCalle] = useState("");
  const [alcaldia, setAlcaldia] = useState("Álvaro Obregón");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [coords, setCoords] = useState("");
  const [referencias, setReferencias] = useState("");
  const [entre_calle1, setEntreCalle1] = useState("");
  const [entre_calle2, setEntreCalle2] = useState("");

  const [center, setCenter] = useState({ lat: 19.430154, lng: -99.137414 });
  const [zoom, setZoom] = useState(12);
  const [marker, setMarker] = useState(null);

  const handleMapClick = (latLng) => {
    const newMarker = { lat: latLng.lat(), lng: latLng.lng() };
    setMarker(newMarker);
    setCoords(`${newMarker.lat},${newMarker.lng}`);
    setCenter(newMarker);
    setZoom(18);
  };

  const alcaldiasCDMX = [
    "Álvaro Obregón",
    "Azcapotzalco",
    "Benito Juárez",
    "Coyoacán",
    "Cuajimalpa de Morelos",
    "Cuauhtémoc",
    "Gustavo A. Madero",
    "Iztacalco",
    "Iztapalapa",
    "Magdalena Contreras",
    "Miguel Hidalgo",
    "Milpa Alta",
    "Tláhuac",
    "Tlalpan",
    "Venustiano Carranza",
    "Xochimilco",
  ];

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
      confirmButtonText: "OK",
    });
  };

  const checkDireccionExistente = async () => {
    try {
      const response = await axios.get(checkURI, {
        params: {
          calle,
          alcaldia,
          codigo_postal: codigoPostal,
        },
      });
  
      const exists = response.data; // true o false según el backend
      if (exists) {
        // Verificar si los datos coinciden con los de la dirección actual
        const currentDireccion = await axios.get(`${URI}?idDireccion=${ID_Direccion}`);
        const { calle: currentCalle, alcaldia: currentAlcaldia, codigoPostal: currentCodigoPostal } = currentDireccion.data;
  
        // Si coinciden, no es un duplicado
        if (
          calle === currentCalle &&
          alcaldia === currentAlcaldia &&
          codigoPostal === currentCodigoPostal
        ) {
          return false; // No es un duplicado
        }
  
        return true; // Es un duplicado
      }
      return false; // No existe otra dirección con los mismos datos
    } catch (error) {
      console.error("Error al verificar la existencia de la dirección:", error);
      return false;
    }
  };
  

  const updateDireccion = async (e) => {
    e.preventDefault();
  
    // Validar que todos los campos estén completos
    if (!calle || !alcaldia || !codigoPostal || !coords || !referencias || !entre_calle1 || !entre_calle2) {
      showErrorAlert("Todos los campos son obligatorios.");
      return;
    }
  
    // Validar el formato del código postal
    const codigoPostalRegex = /^[0-9]{5}$/;
    if (!codigoPostalRegex.test(codigoPostal)) {
      showErrorAlert("El código postal debe contener exactamente 5 dígitos numéricos.");
      return;
    }
  
    try {
      // Verificar si la dirección ya existe y no es la misma que la actual
      const isDuplicate = await checkDireccionExistente();
      if (isDuplicate) {
        showErrorAlert("Ya existe otra dirección con los mismos datos.");
        return;
      }
  
      // Crear el objeto con los datos de la dirección a actualizar
      const datosDireccion = {
        idDireccion: parseInt(ID_Direccion),
        calle,
        alcaldia,
        codigoPostal,
        coords,
        referencias,
        entre_calle1,
        entre_calle2,
      };
  
      // Hacer la solicitud PUT para actualizar la dirección
      const response = await axios.put(updURI, datosDireccion, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status === 200) {
        Swal.fire("Éxito", "La dirección fue actualizada correctamente.", "success");
        navigate(`/showDeportivos/admin/null`);
      } else {
        showErrorAlert("No se pudo actualizar la dirección.");
      }
    } catch (error) {
      console.error("Error al actualizar la dirección:", error);
      showErrorAlert("Ocurrió un error al actualizar la dirección.");
    }
  };
  
  

  const getDireccionById = async () => {
    try {
      const res = await axios.get(`${URI}?idDireccion=${ID_Direccion}`);
      const data = res.data;

      setCalle(data.calle || "");
      setAlcaldia(data.alcaldia || "Álvaro Obregón");
      setCodigoPostal(data.codigoPostal || "");
      setReferencias(data.referencias || "");
      setEntreCalle1(data.entre_calle1 || "");
      setEntreCalle2(data.entre_calle2 || "");

      const [lat, lng] = data.coords.split(",").map(parseFloat);
      setCoords(data.coords || "");
      setMarker({ lat, lng });
      setCenter({ lat, lng });
    } catch (error) {
      console.error("Error al obtener la dirección:", error);
      showErrorAlert("No se pudo cargar la dirección.");
    }
  };

  useEffect(() => {
    getDireccionById();
  }, []);

  return (
    <div className="formulario">
      <h1>Editar Dirección</h1>
      <form onSubmit={updateDireccion}>
        <div className="form-group">
          <label>Calle</label>
          <input type="text" value={calle} onChange={(e) => setCalle(e.target.value)} className="form-control" />
        </div>
        <div className="form-group">
          <label>Alcaldía</label>
          <select value={alcaldia} onChange={(e) => setAlcaldia(e.target.value)} className="form-control">
            {alcaldiasCDMX.map((alc, index) => (
              <option key={index} value={alc}>
                {alc}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Código Postal</label>
          <input
            type="text"
            value={codigoPostal}
            onChange={(e) => {
              const input = e.target.value;
              if (/^[0-9]*$/.test(input) && input.length <= 5) {
                setCodigoPostal(input);
              } else if (!/^[0-9]*$/.test(input)) {
                showErrorAlert("El código postal solo puede contener números.");
              }
            }}
            className="form-control"
            maxLength={5}
          />
        </div>
        <div>
          <label>Coordenadas</label>
          <input type="text" value={coords} disabled className="form-control" />
        </div>
        <div style={{ height: "400px", width: "100%" }}>
          <Map center={center} zoom={zoom} onMapClick={handleMapClick} marker={marker} />
        </div>
        <div className="form-group">
          <label>Referencias</label>
          <input type="text" value={referencias} onChange={(e) => setReferencias(e.target.value)} className="form-control" />
        </div>
        <div className="form-group">
          <label>Entre Calle 1</label>
          <input type="text" value={entre_calle1} onChange={(e) => setEntreCalle1(e.target.value)} className="form-control" />
        </div>
        <div className="form-group">
          <label>Entre Calle 2</label>
          <input type="text" value={entre_calle2} onChange={(e) => setEntreCalle2(e.target.value)} className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">
          Actualizar Dirección
        </button>
      </form>
    </div>
  );
};

export default CompEditDireccion;
