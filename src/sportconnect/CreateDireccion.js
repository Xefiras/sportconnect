/* global google */
// Es importante agregar la variable global de google y el script de Google Maps al index.html con la API key.
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const URI_CREATE_DIRECCION = "http://localhost:8080/api/direcciones/createDireccion";
const URI_CHECK_DIRECCION = "http://localhost:8080/api/direcciones/checkDireccion";

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
    }
  }, [map, marker]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};
/* Fin Funcionamiento de Maps */

const CompCreateDireccion = () => {
  const navigate = useNavigate();
  const { deportivo_id } = useParams();
  const [calle, setCalle] = useState("");
  const [alcaldia, setAlcaldia] = useState("Álvaro Obregón");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [coords, setCoords] = useState("");
  const [referencias, setReferencias] = useState("");
  const [entreCalle1, setEntreCalle1] = useState("");
  const [entreCalle2, setEntreCalle2] = useState("");

  const [center, setCenter] = useState({ lat: 19.430154, lng: -99.137414 });
  const [zoom, setZoom] = useState(12);
  const [marker, setMarker] = useState(null);

  const handleMapClick = (latLng) => {
    const newMarker = { lat: latLng.lat(), lng: latLng.lng() };
    setMarker(newMarker);
    setCoords(`${newMarker.lat}, ${newMarker.lng}`);
    setCenter(newMarker);
    setZoom(17);
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
      const response = await axios.get(URI_CHECK_DIRECCION, {
        params: {
          calle,
          alcaldia,
          codigo_postal: codigoPostal,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al verificar la dirección:", error);
      return false;
    }
  };

  const store = async (e) => {
    e.preventDefault();

    // Validar campos requeridos
    if (!calle || !alcaldia || !codigoPostal || !coords || !referencias || !entreCalle1 || !entreCalle2) {
      showErrorAlert("Todos los campos son obligatorios.");
      return;
    }

    // Validar que el código postal no tenga letras
    const codigoPostalRegex = /^[0-9]{5}$/;
    if (!codigoPostalRegex.test(codigoPostal)) {
      showErrorAlert("El código postal debe contener exactamente 5 dígitos numéricos.");
      return;
    }

    try {
      const direccionExistente = await checkDireccionExistente();
      if (direccionExistente) {
        showErrorAlert("Ya existe un deportivo con esa dirección.");
        return;
      }

      const nuevaDireccion = {
        calle,
        alcaldia,
        codigoPostal,
        coords,
        referencias,
        entre_calle1: entreCalle1,
        entre_calle2: entreCalle2,
        deportivo: { idDeportivo: parseInt(deportivo_id, 10) },
      };

      const response = await axios.post(URI_CREATE_DIRECCION, nuevaDireccion);
      if (response.status === 201) {
        Swal.fire("Éxito", "Dirección creada correctamente.", "success");
        navigate(`/createHorario/${deportivo_id}`);
      }
    } catch (error) {
      console.error("Error al guardar la dirección:", error);
      showErrorAlert("Ocurrió un error al guardar la dirección.");
    }
  };

  return (
    <div className="formulario">
      <h1>Ingresar nueva dirección</h1>
      <form onSubmit={store}>
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
          <input type="text" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} className="form-control" maxLength={5} />
        </div>
        <div className="form-group">
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
          <input type="text" value={entreCalle1} onChange={(e) => setEntreCalle1(e.target.value)} className="form-control" />
        </div>
        <div className="form-group">
          <label>Entre Calle 2</label>
          <input type="text" value={entreCalle2} onChange={(e) => setEntreCalle2(e.target.value)} className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">
          Ingresar Dirección
        </button>
      </form>
    </div>
  );
};

export default CompCreateDireccion;
