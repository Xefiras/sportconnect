package com.ipn.mx.SportConnect.controladores;

import com.ipn.mx.SportConnect.entidades.Cancha;
import com.ipn.mx.SportConnect.servicios.CanchaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
            return "Error al crear una chanca:" + e.getMessage();
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

    @GetMapping
    public Cancha obtenerCancha(@RequestParam int idCancha) {
        try{
            return CanchaService.obtenerCancha(idCancha);
        } catch (Exception e) {
            System.out.println("Error al obtener una cancha" + e.getMessage());
        }
        return null;
    }

    @PutMapping("/updateCancha")
    public String updateCancha(@RequestBody Cancha cancha){
        try{
            CanchaService.updateCancha(cancha);
        } catch(Exception e){
            System.out.println("Error al actualizar una cancha: " + e.getMessage());
        }
        return null;
    }

    // Eliminar una cancha
    @DeleteMapping("/deleteCancha")
    public String deleteCancha(@RequestParam int idCancha){
        try{
            CanchaService.eliminarCancha(idCancha);
        }catch(Exception e){
            return "Error al eliminar un deportivo: " + e.getMessage();
        }
        return null;
    }
}