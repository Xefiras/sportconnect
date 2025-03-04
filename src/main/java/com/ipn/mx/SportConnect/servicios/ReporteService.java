package com.ipn.mx.SportConnect.servicios;

import com.ipn.mx.SportConnect.entidades.Reporte;

import java.util.List;
import java.util.Optional;

public interface ReporteService {
    void guardarReporte(Reporte reporte);

    List<Reporte> obtenerAllReportes();

    List<Reporte> obtenerReportesPorEntidad(Reporte.EntidadAsociada entidad);

    Optional<Reporte> obtenerReportePorId(Long id);

    void eliminarReporte(Long idReporte);
}
