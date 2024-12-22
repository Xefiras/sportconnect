/* global google */
// Es importante agregar la variable global de google y el script de Google Maps al index.html con la API key.
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const URI = "http://localhost:8080/api/direcciones/createDireccion";
const URICDE = "http://localhost:8080/api/direcciones/checkDireccion";

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
  const { deportivo_id } = useParams(); // Recibir el ID del deportivo
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
  const searchInputRef = useRef(null);

  const handleMapClick = (latLng) => {
    const newMarker = { lat: latLng.lat(), lng: latLng.lng() };
    setMarker(newMarker);
    setCoords(`${newMarker.lat}, ${newMarker.lng}`);
    setCenter(newMarker);
    setZoom(17);
  };
  console.log(deportivo_id);
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

  useEffect(() => {
    if (searchInputRef.current && window.google) {
      const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current);
      autocomplete.setTypes(["establishment"]);
      const mexicoCityBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(19.1500, -99.3250),
        new google.maps.LatLng(19.6300, -98.9900)
      );
      autocomplete.setBounds(mexicoCityBounds);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.geometry) {
          const location = place.geometry.location;
          const newCenter = { lat: location.lat(), lng: location.lng() };
          setCenter(newCenter);
          setMarker(newCenter);
          setCoords(`${newCenter.lat}, ${newCenter.lng}`);
          setZoom(18);
        }
      });
    }
  }, [searchInputRef]);

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
      const response = await axios.get(`${URICDE}`, {
        params: {
          calle,
          alcaldia,
          codigo_postal: codigoPostal,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al verificar la existencia de la dirección:", error);
      return false;
    }
  };

  const store = async (e) => {
    e.preventDefault();
  
    if (!calle || !alcaldia || !codigoPostal || !coords || !referencias || !entre_calle1 || !entre_calle2) {
      showErrorAlert("Todos los campos son obligatorios.");
      return;
    }
  
    try {
      const direccionExistente = await checkDireccionExistente();
      if (direccionExistente) {
        showErrorAlert("Ya existe un deportivo con esa dirección.");
        return;
      }
  
      const datosDireccion = {
        calle,
        alcaldia,
        codigoPostal,
        coords,
        referencias,
        entre_calle1,
        entre_calle2,
        deportivo: {
          idDeportivo: parseInt(deportivo_id) // Aquí se ajusta el ID del deportivo.
        }
      };
  
      console.log("Datos enviados al backend:", datosDireccion);
  
      const response = await axios.post(URI, datosDireccion);
      if (response.status === 201) {
        Swal.fire("Éxito", "La dirección fue creada correctamente.", "success");
        navigate(`/createHorario/${deportivo_id}`);
      }
    } catch (error) {
      console.error("Error al crear la dirección:", error);
      showErrorAlert("Ocurrió un error al guardar la dirección.");
    }
  };
  

  return (
    <div className="formulario">
      <h1>Ingresar nueva dirección:</h1>
      <form onSubmit={store}>
        <div className="form-group">
          <label>Calle</label>
          <input type="text" value={calle} onChange={(e) => setCalle(e.target.value)} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Alcaldía</label>
          <select value={alcaldia} onChange={(e) => setAlcaldia(e.target.value)} className="form-control" required>
            {alcaldiasCDMX.map((alc, index) => (
              <option key={index} value={alc}>
                {alc}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Código Postal</label>
          <input type="text" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} className="form-control" maxLength={5} required />
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
          <input type="text" value={referencias} onChange={(e) => setReferencias(e.target.value)} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Entre Calle 1</label>
          <input type="text" value={entre_calle1} onChange={(e) => setEntreCalle1(e.target.value)} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Entre Calle 2</label>
          <input type="text" value={entre_calle2} onChange={(e) => setEntreCalle2(e.target.value)} className="form-control" required />
        </div>
        <button type="submit" className="btn btn-primary">
          Ingresar Dirección
        </button>
      </form>
    </div>
  );
};

export default CompCreateDireccion;
