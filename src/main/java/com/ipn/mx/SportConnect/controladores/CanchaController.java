package com.ipn.mx.SportConnect.controladores;

import com.ipn.mx.SportConnect.entidades.Cancha;
import com.ipn.mx.SportConnect.entidades.Mejora;
import com.ipn.mx.SportConnect.servicios.CanchaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/canchas") // Define la ruta base
public class CanchaController {

    @Autowired
    private CanchaService CanchaService;

    @PostMapping("/createCancha")
    public String crearCancha(@RequestBody Cancha cancha){
        try{
            CanchaService.crearCancha(cancha);
            return "Cancha creada con exito!";
        }catch(Exception e){
            return "Error al crear una cancha:" + e.getMessage();
        }
    }

    @GetMapping("/obtenerCanchas")
    public List<Cancha> obtenerCanchas(){
        try{
            return CanchaService.obtenerCanchas();
        } catch (Exception e) {
            System.out.println("Error al obtener todas las canchas:" + e. getMessage());
        }
        return null;
    }

    @GetMapping("/obtenerCancha")
    public Cancha obtenerCancha(@RequestParam Long idCancha) {
        try{
            return CanchaService.obtenerCancha(idCancha);
        } catch (Exception e) {
            System.out.println("Error al obtener una cancha" + e.getMessage());
        }
        return null;
    }

    @PutMapping("/updateCancha")
    public ResponseEntity<String> updateCancha(@RequestBody Cancha cancha) {
        try {
            // Recuperar la cancha existente por ID
            Cancha canchaExistente = CanchaService.obtenerCancha(cancha.getId_cancha());
            if (canchaExistente == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La cancha no existe.");
            }

            // Actualizar únicamente los campos relacionados con la cancha
            canchaExistente.setTipo_cancha(cancha.getTipo_cancha());
            canchaExistente.setNumero_cancha(cancha.getNumero_cancha());
            canchaExistente.setMaterial_piso(cancha.getMaterial_piso());
            canchaExistente.setTiene_techo(cancha.getTiene_techo());
            canchaExistente.setTiene_gradas(cancha.getTiene_gradas());
            canchaExistente.setEstado(cancha.getEstado());
            canchaExistente.setCapacidad_jugadores(cancha.getCapacidad_jugadores());
            canchaExistente.setCoordenadas_cancha(cancha.getCoordenadas_cancha());

            // Manejar las mejoras asociadas
            if (cancha.getMejoras() != null) {
                // Eliminar mejoras existentes si no están en la nueva lista
                List<Mejora> mejorasActualizadas = cancha.getMejoras();
                canchaExistente.getMejoras().removeIf(
                        mejoraExistente -> mejorasActualizadas.stream()
                                .noneMatch(mejoraNueva -> mejoraNueva.getId_mejora() == mejoraExistente.getId_mejora())
                );

                // Actualizar o agregar mejoras
                for (Mejora mejoraNueva : mejorasActualizadas) {
                    Optional<Mejora> mejoraExistenteOpt = canchaExistente.getMejoras().stream()
                            .filter(m -> m.getId_mejora() == mejoraNueva.getId_mejora())
                            .findFirst();

                    if (mejoraExistenteOpt.isPresent()) {
                        // Actualizar mejora existente
                        Mejora mejoraExistente = mejoraExistenteOpt.get();
                        mejoraExistente.setNombre_mejora(mejoraNueva.getNombre_mejora());
                        mejoraExistente.setDescripcion_mejora(mejoraNueva.getDescripcion_mejora());
                        mejoraExistente.setJustificacion_mejora(mejoraNueva.getJustificacion_mejora());
                        mejoraExistente.setFecha_implementacion(mejoraNueva.getFecha_implementacion());
                    } else {
                        // Agregar nueva mejora
                        canchaExistente.getMejoras().add(mejoraNueva);
                    }
                }
            }

            // Guardar los cambios en la base de datos
            CanchaService.updateCancha(canchaExistente);

            return ResponseEntity.ok("La cancha fue actualizada con éxito.");
        } catch (Exception e) {
            System.out.println("Error al actualizar una cancha: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ocurrió un error al actualizar la cancha.");
        }
    }




            // Eliminar una cancha
    @DeleteMapping("/deleteCancha")
    public String deleteCancha(@RequestParam Long idCancha){
        try{
            CanchaService.eliminarCancha(idCancha);
        }catch(Exception e){
            return "Error al eliminar un deportivo: " + e.getMessage();
        }
        return null;
    }
}