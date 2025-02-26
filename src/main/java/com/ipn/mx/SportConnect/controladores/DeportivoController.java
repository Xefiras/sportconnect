package com.ipn.mx.SportConnect.controladores;

import com.ipn.mx.SportConnect.entidades.Deportivo;
import com.ipn.mx.SportConnect.servicios.DeportivoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/deportivos")
public class DeportivoController {

    @Autowired
    private DeportivoService deportivoService;

    @PostMapping("/createDeportivo")
    public ResponseEntity<?> crearDeportivo(@RequestBody Deportivo deportivo) {
        try {
            Deportivo nuevoDeportivo = deportivoService.crearDeportivo(deportivo);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Deportivo creado con éxito!");
            response.put("ID_Deportivo", nuevoDeportivo.getIdDeportivo()); // Asegúrate de que `getIdDeportivo` existe en tu clase `Deportivo`
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error al crear el deportivo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }


    @GetMapping("/obtenerDeportivos")
    public List<Deportivo> obtenerDeportivos(){
        try{
            return deportivoService.obtenerDeportivos();
        } catch (Exception e) {
            System.out.println("Error al obtener todos los deportivos: " + e.getMessage());
        }
        return null;
    }

    @GetMapping("/obtenerDeportivo")
    //http://localhost:8080/api/deportivos/obtenerDeportivo?idDeportivo=11
    //Se hace el requestparam con el nombre de la variable que está en el parámetro, mas no con la que está definida en la BD
    public Deportivo obtenerDeportivo(@RequestParam Long idDeportivo){
        try{
            return deportivoService.obtenerDeportivo(idDeportivo);
        } catch (Exception e) {
            System.out.println("Error al obtener un deportivo: " + e.getMessage());
        }
        return null;
    }

    @PutMapping("/updateDeportivo")
    public ResponseEntity<?> updateDeportivo(@RequestBody Deportivo deportivo) {
        try {
            Deportivo existente = deportivoService.obtenerDeportivo(deportivo.getIdDeportivo());
            if (existente == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Deportivo no encontrado");
            }

            // Actualizar solo los campos básicos
            existente.setNombre(deportivo.getNombre());
            existente.setNumero_registro(deportivo.getNumero_registro());
            existente.setAcepta_mascotas(deportivo.isAcepta_mascotas());
            existente.setTiene_tienda(deportivo.isTiene_tienda());
            existente.setTiene_vestidores(deportivo.isTiene_vestidores());
            existente.setTiene_regaderas(deportivo.isTiene_regaderas());
            existente.setTiene_medico(deportivo.isTiene_medico());

            deportivoService.updateDeportivo(existente);

            return ResponseEntity.ok("Información básica del deportivo actualizada con éxito!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el deportivo: " + e.getMessage());
        }
    }

    //Ya elimina el deportivo y todo lo relacionado al mismo gracias a las relaciones cardinales
    @DeleteMapping("/deleteDeportivo")
    public String deleteDeportivo(@RequestParam Long idDeportivo){
        try{
            deportivoService.eliminarDeportivo(idDeportivo);
            return "Deportivo eliminado con éxito!";
        } catch(Exception e){
            return "Error al eliminar un deportivo: " + e.getMessage();
        }
    }

    @GetMapping("/getDeportivoByEncargado/{rfcCurp}")
    public ResponseEntity<?> getDeportivosByEncargado(@PathVariable String rfcCurp) {
        if (rfcCurp == null || rfcCurp.isEmpty()) {
            return ResponseEntity.badRequest().body("RFC_CURP es requerido");
        }

        try {
            List<Deportivo> deportivos = deportivoService.getDeportivosByEncargado(rfcCurp);

            if (deportivos.isEmpty()) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            return ResponseEntity.ok(deportivos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor" + e.getMessage());
        }
    }
}

