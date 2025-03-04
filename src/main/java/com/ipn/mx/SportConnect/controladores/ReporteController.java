package com.ipn.mx.SportConnect.controladores;

import com.ipn.mx.SportConnect.entidades.Reporte;
import com.ipn.mx.SportConnect.servicios.ReporteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    private final ReporteService reporteService;

    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    @Operation(
            summary = "Guardar un nuevo reporte o actualizar uno existente.",
            description = "Este endpoint permite guardar un nuevo reporte en la base de datos o actualizar uno existente si se proporciona un ID. " +
                    "Para crear un reporte nuevo, se debe enviar la información completa, incluyendo la entidad asociada (deportivo o cancha). " +
                    "Si se actualiza un reporte existente, solo se modifican los datos especificados, sin cambiar la entidad asociada."
    )
    @ApiResponses(value = {
           @ApiResponse(responseCode = "201", description = "Reporte guardado correctamente."),
           @ApiResponse(responseCode = "400", description = "No se ha proveido una entidad asociada"),
            @ApiResponse(responseCode = "500", description = "El reporte no tiene una entidad asociada")
    })
    @PostMapping("/guardarReporte")
    public ResponseEntity<?> guardarReporte(@RequestBody Reporte reporte){
        try {
            //Si el reporte ya tiene un ID, quiere decir que se va actualizar su informacion.
            if (reporte.getIdReporte() != null) {
                //Se busca el reporte en la base de datos por medio de un optional, que facilita el manejo NPE si es que no se encuentra dicho elemento
                Optional<Reporte> reporteExistenteOpt = reporteService.obtenerReportePorId(reporte.getIdReporte());
                //Si el reporte esta presente, se asigna a un nuevo DTO y se empieza a sustituir su informacion con la del
                //reporte proveido por el front
                if (reporteExistenteOpt.isPresent()) {
                    Reporte reporteExistente = reporteExistenteOpt.get();

                    reporteExistente.setIdReporte(reporte.getIdReporte());
                    reporteExistente.setNombreInteresado(reporte.getNombreInteresado());
                    reporteExistente.setPrimerApellidoInteresado(reporte.getPrimerApellidoInteresado());
                    reporteExistente.setSegundoApellidoInteresado(reporte.getSegundoApellidoInteresado());
                    reporteExistente.setCorreoElectronicoInteresado(reporte.getCorreoElectronicoInteresado());
                    reporteExistente.setTipoReporte(reporte.getTipoReporte());
                    reporteExistente.setEntidadAsociada(reporte.getEntidadAsociada());
                    reporteExistente.setTituloReporte(reporte.getTituloReporte());
                    reporteExistente.setNumeroCancha(reporte.getNumeroCancha());
                    reporteExistente.setDescripcionReporte(reporte.getDescripcionReporte());
                    reporteExistente.setFechaIdentificacion(reporte.getFechaIdentificacion());
                    reporteExistente.setHoraIdentificacion(reporte.getHoraIdentificacion());
                    //En este caso, el reporte ya deberia tener una entidad asociada (cancha o deportivo)
                    //por lo que no es necesario buscar dicha entidad ni recuperarla de la BD
                    if (reporte.getDeportivo() != null) {
                        reporteExistente.setDeportivo(reporte.getDeportivo());
                    } else if (reporte.getCancha() != null) {
                        reporteExistente.setCancha(reporte.getCancha());
                    } else {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: el reporte a actualizar no tiene una entidad asociada.");
                    }
                    // Guardar el reporte actualizado
                    reporteService.guardarReporte(reporteExistente);
                }

            } else {//Si el reporte no tiene idReporte, quiere decir que es un reporte a crear en la base de datos
                //Si no se encuentra un deportivo o cancha en la información proveída, entonces está incompleta y no se procede.
                if(reporte.getDeportivo() == null
                        || reporte.getCancha() == null
                            || reporte.getDeportivo().getIdDeportivo() == null
                                || reporte.getCancha().getId_cancha() == null) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: no se ha proveído una entidad asociada.");
                }

                Reporte nuevoReporte = new Reporte();

                nuevoReporte.setNombreInteresado(reporte.getNombreInteresado());
                nuevoReporte.setPrimerApellidoInteresado(reporte.getPrimerApellidoInteresado());
                nuevoReporte.setSegundoApellidoInteresado(reporte.getSegundoApellidoInteresado());
                nuevoReporte.setCorreoElectronicoInteresado(reporte.getCorreoElectronicoInteresado());
                nuevoReporte.setTipoReporte(reporte.getTipoReporte());
                nuevoReporte.setEntidadAsociada(reporte.getEntidadAsociada());
                nuevoReporte.setTituloReporte(reporte.getTituloReporte());
                nuevoReporte.setNumeroCancha(reporte.getNumeroCancha());
                nuevoReporte.setDescripcionReporte(reporte.getDescripcionReporte());
                nuevoReporte.setFechaIdentificacion(reporte.getFechaIdentificacion());
                nuevoReporte.setHoraIdentificacion(reporte.getHoraIdentificacion());

                if (reporte.getDeportivo() != null) {
                    nuevoReporte.setDeportivo(reporte.getDeportivo());
                } else if (reporte.getCancha() != null) {
                    nuevoReporte.setCancha(reporte.getCancha());
                }
                reporteService.guardarReporte(nuevoReporte);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body("Reporte guardado correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al guardar el reporte: " + e.getMessage());
        }
    }
}
