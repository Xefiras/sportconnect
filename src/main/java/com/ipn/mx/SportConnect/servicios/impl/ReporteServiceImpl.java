package com.ipn.mx.SportConnect.servicios.impl;

import com.ipn.mx.SportConnect.entidades.Reporte;
import com.ipn.mx.SportConnect.repositorios.ReporteRepository;
import com.ipn.mx.SportConnect.servicios.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; //Hay que importar el transactional de Spring, no de Jakarta

import java.util.List;
import java.util.Optional;

@Service
public class ReporteServiceImpl implements ReporteService {

    /*
    //Inyección del Bean @Repository ReporteRepository por campo
    @Autowired
    ReporteRepository reporteRepository;*/

    private final ReporteRepository reporteRepository;

    // Inyección de dependencias por constructor (mejor que usar @Autowired en campo)
    //Para evitar problemas de NullPointerException
    public ReporteServiceImpl(ReporteRepository reporteRepository) {
        this.reporteRepository = reporteRepository;
    }
    @Override
    @Transactional
    public void guardarReporte(Reporte reporte) {
        if(reporte == null)
            throw new IllegalArgumentException("El reporte no puede ser nulo");

        reporteRepository.save(reporte);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reporte> obtenerAllReportes() {
        return reporteRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    //Se utiliza el enum Reporte.EntidadAsociada que se creó en la entidad
    //Robusteciendo la lógica del sistema
    public List<Reporte> obtenerReportesPorEntidad(Reporte.EntidadAsociada entidad) {
        if(entidad == null)
            throw new IllegalArgumentException("El entidad no puede ser nulo");
        return reporteRepository.findReportesByEntidadAsociada(entidad);
    }

    //Se usa optional para almacenar el reporte, que si no existe toma el valor de Optional.empty()
    //que no es null, pero no contiene ningún objeto.
    @Override
    @Transactional(readOnly = true)
    public Optional<Reporte> obtenerReportePorId(Long id) {
        return reporteRepository.findById(id);
    }

    @Override
    @Transactional
    public void eliminarReporte(Long idReporte) {
        Optional<Reporte> reporteOptional = reporteRepository.findById(idReporte);
        if(reporteOptional.isPresent())
            reporteRepository.deleteById(idReporte);
        else
            throw new IllegalArgumentException("El reporte no existe en el sistema con ID: " + idReporte);
    }
}
