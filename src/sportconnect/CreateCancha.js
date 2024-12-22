/* global google */
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const URI = "http://localhost:8080/api/canchas/createCancha";

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

const CompCreateCancha = () => {
  const navigate = useNavigate();
  const { ID_Deportivo, coordsParam, RFC_CURP } = useParams();

  const parseCoords = (coords) => {
    const [lat, lng] = coords ? coords.split(",").map(parseFloat) : [NaN, NaN];
    return isNaN(lat) || isNaN(lng)
      ? { lat: 19.432608, lng: -99.133209 }
      : { lat, lng };
  };

  const [Tipo_Cancha, setTipoCancha] = useState("Fútbol");
  const [Numero_Cancha, setNumeroCancha] = useState("");
  const [Material_Piso, setMaterialPiso] = useState("Césped");
  const [Techado, setTechado] = useState(false);
  const [Con_Gradas, setConGradas] = useState(false);
  const [Estado, setEstado] = useState("Excelente");
  const [Capacidad_Jugadores, setCapacidadJugadores] = useState("");
  const [Coordenadas, setCoordenadas] = useState("");
  const [mejoras, setMejoras] = useState([]);
  const [newMejora, setNewMejora] = useState({
    nombre_mejora: "",
    descripcion_mejora: "",
    justificacion_mejora: "",
    fecha_implementacion: "",
  });

  const [center, setCenter] = useState(parseCoords(coordsParam));
  const [zoom, setZoom] = useState(17);
  const [marker, setMarker] = useState(null);

  const handleMapClick = (latLng) => {
    const newMarker = { lat: latLng.lat(), lng: latLng.lng() };
    setMarker(newMarker);
    setCoordenadas(`${newMarker.lat},${newMarker.lng}`);
    setCenter(newMarker);
  };

  const addMejora = () => {
    if (
      !newMejora.nombre_mejora ||
      !newMejora.descripcion_mejora ||
      !newMejora.justificacion_mejora ||
      !newMejora.fecha_implementacion
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Todos los campos de la mejora son obligatorios.",
      });
      return;
    }

    setMejoras([...mejoras, newMejora]);
    setNewMejora({
      nombre_mejora: "",
      descripcion_mejora: "",
      justificacion_mejora: "",
      fecha_implementacion: "",
    });
  };

  const store = async (e) => {
    e.preventDefault();

    if (!Coordenadas || !Numero_Cancha || !Capacidad_Jugadores) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Todos los campos son obligatorios.",
      });
      return;
    }

    try {
      const payload = {
        tipo_cancha: Tipo_Cancha,
        numero_cancha: Numero_Cancha,
        material_piso: Material_Piso,
        tiene_techo: Techado,
        tiene_gradas: Con_Gradas,
        estado: Estado,
        capacidad_jugadores: parseInt(Capacidad_Jugadores),
        coordenadas_cancha: Coordenadas,
        deportivo: {
          idDeportivo: parseInt(ID_Deportivo),
        },
        mejoras: mejoras,
      };

      await axios.post(URI, payload);

      Swal.fire("Éxito", "La cancha fue creada correctamente.", "success");
      navigate(`/showDeportivos/enc/${RFC_CURP}`);
    } catch (error) {
      console.error("Error al crear la cancha:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar la cancha.",
      });
    }
  };

  return (
    <div className="formulario">
      <h1>Ingresar nueva cancha</h1>
      <form onSubmit={store}>
        <div className="form-group">
          <label>Coordenadas</label>
          <input
            type="text"
            value={Coordenadas}
            disabled
            className="form-control"
          />
        </div>
        <div style={{ height: "400px", width: "100%" }}>
          <Map
            center={center}
            zoom={zoom}
            onMapClick={handleMapClick}
            marker={marker}
          />
        </div>
        <div className="form-group">
          <label>Tipo Cancha</label>
          <select
            value={Tipo_Cancha}
            onChange={(e) => setTipoCancha(e.target.value)}
            className="form-control"
          >
            <option value="Fútbol">Fútbol</option>
            <option value="Básquetbol">Básquetbol</option>
            <option value="Tenis">Tenis</option>
          </select>
        </div>
        <div className="form-group">
          <label>Numero de Cancha</label>
          <input
            type="text"
            value={Numero_Cancha}
            onChange={(e) => setNumeroCancha(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Capacidad de Jugadores</label>
          <input
            type="number"
            value={Capacidad_Jugadores}
            onChange={(e) => setCapacidadJugadores(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Mejoras</label>
          <div>
            <input
              type="text"
              placeholder="Nombre"
              value={newMejora.nombre_mejora}
              onChange={(e) =>
                setNewMejora({ ...newMejora, nombre_mejora: e.target.value })
              }
              className="form-control"
            />
            <input
              type="text"
              placeholder="Descripción"
              value={newMejora.descripcion_mejora}
              onChange={(e) =>
                setNewMejora({
                  ...newMejora,
                  descripcion_mejora: e.target.value,
                })
              }
              className="form-control"
            />
            <input
              type="text"
              placeholder="Justificación"
              value={newMejora.justificacion_mejora}
              onChange={(e) =>
                setNewMejora({
                  ...newMejora,
                  justificacion_mejora: e.target.value,
                })
              }
              className="form-control"
            />
            <input
              type="date"
              value={newMejora.fecha_implementacion}
              onChange={(e) =>
                setNewMejora({
                  ...newMejora,
                  fecha_implementacion: e.target.value,
                })
              }
              className="form-control"
            />
            <button
              type="button"
              className="btn btn-secondary mt-2"
              onClick={addMejora}
            >
              Agregar Mejora
            </button>
          </div>
          <ul>
            {mejoras.map((mejora, index) => (
              <li key={index}>
                {mejora.nombre_mejora} - {mejora.descripcion_mejora}
              </li>
            ))}
          </ul>
        </div>
        <button type="submit" className="btn btn-primary">
          Crear Cancha
        </button>
      </form>
    </div>
  );
};

export default CompCreateCancha;
