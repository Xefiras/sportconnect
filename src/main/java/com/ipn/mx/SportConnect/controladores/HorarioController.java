package com.ipn.mx.SportConnect.controladores;

import com.ipn.mx.SportConnect.entidades.Horario;
import com.ipn.mx.SportConnect.servicios.HorarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/horarios")
public class HorarioController {

    @Autowired
    private HorarioService horarioService;

    @GetMapping("/obtenerHorarios")
    public List<Horario> obtenerHorarios(){
        try{
            return horarioService.obtenerHorarios();
        } catch (Exception e) {
            System.out.println("Error al obtener todos los deportivos: " + e.getMessage());
        }
        return null;
    }

    @Operation(
            summary = "Obtener horarios por ID de Deportivo",
            description = "Este endpoint devuelve una lista de horarios asociados a un ID de deportivo proporcionado."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de horarios obtenida exitosamente."),
            @ApiResponse(responseCode = "404", description = "No se encontraron horarios para el ID de deportivo proporcionado.")
    })
    @GetMapping("/deportivo/{idDeportivo}")
    public List<Horario> obtenerHorariosPorDeportivo(@PathVariable int idDeportivo) {
        List<Horario> horarios = horarioService.obtenerHorariosPorDeportivo(idDeportivo);
        if (horarios.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No se encontraron horarios para el deportivo con id: " + idDeportivo);
        }
        return horarios;
    }

    @Operation(
            summary = "Crear o actualizar un horario",
            description = "Este endpoint permite crear un nuevo horario o actualizar uno existente. Es necesario proporcionar los datos del horario en el cuerpo de la solicitud en caso de actualización" +
                    "y en caso de creación, hay que indicar el id del deportivo"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Horario creado o actualizado exitosamente.")
    })
    //Se usan DTOs (Data Transfer Object) para guardar los horarios, ya que no es posible guardar directamente un objeto al necesitar del deportivo_id, cosa que
    //no se proporciona al recuperar los horarios por el JsonMangedReference y JsonBackReference
    @PostMapping("/guardarHorario")
    public ResponseEntity<?> guardarHorarios(@RequestBody List<Horario> horarios) {
        try {
            for (Horario horario : horarios) {
                if (horario.getIdHorario() != null) {
                    // Si el horario ya tiene un ID, intentamos actualizarlo
                    // Se usa Optional para manejar null en caso de que no encuentre el horario
                    // Se recupera el horario original, principalmente para obtener el deportivo_id implícito
                    Optional<Horario> horarioExistenteOpt = horarioService.obtenerHorarioPorId(horario.getIdHorario());
                    //Si encuentra el horario, se asigna a una variable de tipo Horario y se reemplaza la información actualizada
                    if (horarioExistenteOpt.isPresent()) {
                        Horario horarioExistente = horarioExistenteOpt.get(); //Se asigna

                        // Actualizar solo los campos del horario sin modificar el id del deportivo
                        horarioExistente.setDiaSemana(horario.getDiaSemana());
                        horarioExistente.setHoraApertura(horario.getHoraApertura());
                        horarioExistente.setHoraCierre(horario.getHoraCierre());
                        horarioExistente.setInhabil(horario.isInhabil());

                        // Guardar los cambios
                        horarioService.guardarHorario(horarioExistente);
                    } else {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Horario con ID " + horario.getIdHorario() + " no encontrado.");
                    }
                } else {
                    // Si el horario no tiene ID, es un nuevo horario y debemos asignarle un deportivo
                    if (horario.getDeportivo() == null || horario.getDeportivo().getIdDeportivo() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Se requiere un ID de Deportivo para guardar un nuevo horario.");
                    }

                    // Crear un nuevo horario con el deportivo asignado
                    Horario nuevoHorario = new Horario();
                    nuevoHorario.setDeportivo(horario.getDeportivo()); // Asignar el deportivo
                    nuevoHorario.setDiaSemana(horario.getDiaSemana());
                    nuevoHorario.setHoraApertura(horario.getHoraApertura());
                    nuevoHorario.setHoraCierre(horario.getHoraCierre());
                    nuevoHorario.setInhabil(horario.isInhabil());

                    // Guardar el nuevo horario
                    horarioService.guardarHorario(nuevoHorario);
                }
            }
            return ResponseEntity.status(HttpStatus.CREATED).body("Horarios guardados o actualizados exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al guardar los horarios: " + e.getMessage());
        }
    }
}
