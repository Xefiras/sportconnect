/* global google */
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const URI = "http://localhost:8080/api/canchas/obtenerCancha";
const updURI = "http://localhost:8080/api/canchas/updateCancha";
const delMejoraURI = "http://localhost:8080/api/mejoras/deleteMejora";

/* Función para formatear fecha a "yyyy-MM-dd" */
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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

const CompEditCancha = () => {
  const navigate = useNavigate();
  const { ID_Cancha, ID_Deportivo, RFC_CURP } = useParams();
  const [tipo_cancha, setTipoCancha] = useState("Fútbol");
  const [numero_cancha, setNumeroCancha] = useState("");
  const [material_piso, setMaterialPiso] = useState("Césped");
  const [tiene_techo, setTieneTecho] = useState(false);
  const [tiene_gradas, setTieneGradas] = useState(false);
  const [estado, setEstado] = useState("Buena Condición");
  const [capacidad_jugadores, setCapacidadJugadores] = useState(0);
  const [coordenadas_cancha, setCoordenadasCancha] = useState("");
  const [mejoras, setMejoras] = useState([]);
  const [center, setCenter] = useState({ lat: 19.430154, lng: -99.137414 });
  const [zoom, setZoom] = useState(17);
  const [marker, setMarker] = useState(null);

  const handleMapClick = (latLng) => {
    const newMarker = { lat: latLng.lat(), lng: latLng.lng() };
    setMarker(newMarker);
    setCoordenadasCancha(`${newMarker.lat},${newMarker.lng}`);
    setCenter(newMarker);
    setZoom(18);
  };

  useEffect(() => {
    getCanchaById();
  }, []);

  const getCanchaById = async () => {
    try {
      const res = await axios.get(`${URI}?idCancha=${ID_Cancha}`);
      const data = res.data;

      setTipoCancha(data.tipo_cancha || "");
      setNumeroCancha(data.numero_cancha || "");
      setMaterialPiso(data.material_piso || "");
      setTieneTecho(data.tiene_techo || false);
      setTieneGradas(data.tiene_gradas || false);
      setEstado(data.estado || "Buena Condición");
      setCapacidadJugadores(data.capacidad_jugadores || 0);
      setCoordenadasCancha(data.coordenadas_cancha || "");
      setMejoras(
        (data.mejoras || []).map((mejora) => ({
          ...mejora,
          fecha_implementacion: formatDate(mejora.fecha_implementacion),
        }))
      );
      const [lat, lng] = data.coordenadas_cancha.split(",").map(parseFloat);
      setMarker({ lat, lng });
      setCenter({ lat, lng });
    } catch (error) {
      Swal.fire("Error", "No se pudo cargar la cancha.", "error");
    }
  };

  const updateCancha = async (e) => {
    e.preventDefault();

    try {
      const data = {
        id_cancha: parseInt(ID_Cancha, 10),
        tipo_cancha,
        numero_cancha,
        material_piso,
        tiene_techo,
        tiene_gradas,
        estado,
        capacidad_jugadores: parseInt(capacidad_jugadores, 10),
        coordenadas_cancha,
        mejoras: mejoras.map((mejora) => ({
          id_mejora: mejora.id_mejora,
          nombre_mejora: mejora.nombre_mejora,
          descripcion_mejora: mejora.descripcion_mejora,
          justificacion_mejora: mejora.justificacion_mejora,
          fecha_implementacion: mejora.fecha_implementacion,
        })),
      };

      console.log(JSON.stringify(data, null, 4));

      const response = await axios.put(updURI, data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        Swal.fire("Éxito", "Cancha editada correctamente.", "success");
        navigate(`/showDeportivos/enc/${RFC_CURP}`);
      } else {
        Swal.fire("Error", "No se pudo editar la cancha.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al editar la cancha.", "error");
    }
  };

  const deleteMejora = async (idMejora) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${delMejoraURI}?idMejora=${idMejora}`);

          if (response.status === 200) {
            Swal.fire("Eliminado", "La mejora ha sido eliminada.", "success");
            setMejoras(mejoras.filter((mejora) => mejora.id_mejora !== idMejora));
          } else {
            Swal.fire("Error", "No se pudo eliminar la mejora.", "error");
          }
        } catch (error) {
          Swal.fire("Error", "Hubo un problema al eliminar la mejora.", "error");
        }
      }
    });
  };

  const addMejora = () => {
    setMejoras([
      ...mejoras,
      {
        id_mejora: mejoras.length + 1,
        nombre_mejora: "",
        descripcion_mejora: "",
        justificacion_mejora: "",
        fecha_implementacion: "",
      },
    ]);
  };

  const updateMejora = (index, field, value) => {
    const updatedMejoras = mejoras.map((mejora, i) =>
      i === index ? { ...mejora, [field]: value } : mejora
    );
    setMejoras(updatedMejoras);
  };

  return (
    <div className="formulario">
      <h1>Editar Cancha</h1>
      <form onSubmit={updateCancha}>
        <div>
          <label>Coordenadas (Latitud, Longitud)</label>
          <input type="text" value={coordenadas_cancha} disabled className="form-control" />
        </div>
        <div style={{ height: "400px", width: "100%" }}>
          <Map center={center} zoom={zoom} onMapClick={handleMapClick} marker={marker} />
        </div>
        <div className="form-group">
          <label>Tipo de Cancha</label>
          <input type="text" value={tipo_cancha} onChange={(e) => setTipoCancha(e.target.value)} className="form-control" />
        </div>
        <div className="form-group">
          <label>Numero de Cancha</label>
          <input type="text" value={numero_cancha} onChange={(e) => setNumeroCancha(e.target.value)} className="form-control" />
        </div>
        <div className="form-group">
          <label>Material del Piso</label>
          <input type="text" value={material_piso} onChange={(e) => setMaterialPiso(e.target.value)} className="form-control" />
        </div>
        <div className="form-group">
          <label>Tiene Techo</label>
          <input type="checkbox" checked={tiene_techo} onChange={(e) => setTieneTecho(e.target.checked)} />
        </div>
        <div className="form-group">
          <label>Tiene Gradas</label>
          <input type="checkbox" checked={tiene_gradas} onChange={(e) => setTieneGradas(e.target.checked)} />
        </div>
        <div className="form-group">
          <label>Estado</label>
          <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} className="form-control" />
        </div>
        <div className="form-group">
          <label>Capacidad de Jugadores</label>
          <input type="number" value={capacidad_jugadores} onChange={(e) => setCapacidadJugadores(parseInt(e.target.value, 10))} className="form-control" />
        </div>
        <div>
          <h2>Mejoras</h2>
          {mejoras.map((mejora, index) => (
            <div key={index} className="form-group" style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
              <h3>Mejora {index + 1}</h3>
              <label>Nombre de la Mejora</label>
              <input
                type="text"
                value={mejora.nombre_mejora}
                onChange={(e) => updateMejora(index, "nombre_mejora", e.target.value)}
                className="form-control"
              />
              <label>Descripción</label>
              <input
                type="text"
                value={mejora.descripcion_mejora}
                onChange={(e) => updateMejora(index, "descripcion_mejora", e.target.value)}
                className="form-control"
              />
              <label>Justificación</label>
              <input
                type="text"
                value={mejora.justificacion_mejora}
                onChange={(e) => updateMejora(index, "justificacion_mejora", e.target.value)}
                className="form-control"
              />
              <label>Fecha de Implementación</label>
              <input
                type="date"
                value={mejora.fecha_implementacion}
                onChange={(e) => updateMejora(index, "fecha_implementacion", e.target.value)}
                className="form-control"
              />
              <button type="button" onClick={() => deleteMejora(mejora.id_mejora)} className="btn btn-danger mt-2">
                Eliminar Mejora
              </button>
            </div>
          ))}
          <button type="button" onClick={addMejora} className="btn btn-secondary">
            Agregar Mejora
          </button>
        </div>
        <button type="submit" className="btn btn-primary">
          Editar Cancha
        </button>
      </form>
    </div>
  );
};

export default CompEditCancha;
