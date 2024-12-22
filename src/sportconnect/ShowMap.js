/* global google */
import React, { useEffect, useRef } from 'react';

const GoogleMap = ({ coordinates }) => {
    const mapRef = useRef(null); // Referencia al contenedor del mapa

    useEffect(() => {
        const initializeMap = () => {
            if (mapRef.current && window.google) {
                // Crea un nuevo mapa
                const map = new google.maps.Map(mapRef.current, {
                    center: { lat: coordinates.lat, lng: coordinates.lng },
                    zoom: 17,
                });

                // Crea un marcador en las coordenadas proporcionadas
                new google.maps.Marker({
                    position: { lat: coordinates.lat, lng: coordinates.lng },
                    map: map,
                });
            }
        };

        if (window.google) {
            // Si Google Maps API ya está cargada
            initializeMap();
        } else {
            // Intenta cargar la API de Google Maps si aún no está disponible
            const interval = setInterval(() => {
                if (window.google) {
                    initializeMap();
                    clearInterval(interval); // Limpia el intervalo una vez cargado
                }
            }, 100);
        }
    }, [coordinates]); // Se ejecuta cuando cambian las coordenadas

    return <div ref={mapRef} style={{ height: '300px', width: '100%' }} />;
};

export default GoogleMap;

