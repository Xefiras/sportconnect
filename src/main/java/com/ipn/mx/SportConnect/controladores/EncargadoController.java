package com.miempresa.proyectospring.controller;

import com.miempresa.proyectospring.model.Encargado;
import com.miempresa.proyectospring.service.EncargadoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/encargados")
@Tag(name = "Encargados", description = "API para la gestión de encargados")
public class EncargadoController {

    @Autowired
    private EncargadoService encargadoService;

    @Operation(summary = "Obtener un encargado por ID",
            description = "Devuelve los detalles de un encargado según su ID")
    @GetMapping("/{id}")
    public Optional<Encargado> obtenerEncargado(@PathVariable Long id) {
        return encargadoService.obtenerEncargadoPorId(id);
    }

    @Operation(summary = "Crear o actualizar un encargado",
            description = "Guarda un nuevo encargado o actualiza uno existente")
    @PostMapping
    public Encargado guardarEncargado(@RequestBody Encargado encargado) {
        return encargadoService.guardarEncargado(encargado);
    }

    @Operation(summary = "Eliminar un encargado",
            description = "Elimina un encargado existente según su ID")
    @DeleteMapping("/{id}")
    public void eliminarEncargado(@PathVariable Long id) {
        encargadoService.eliminarEncargado(id);
    }
}