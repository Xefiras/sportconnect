package com.ipn.mx.SportConnect.servicios;

import com.ipn.mx.SportConnect.entidades.Encargado;

import java.util.List;
import java.util.Optional;

public interface EncargadoService {

    // Método para crear y actualziar un encargado
    public Encargado guardarEncargado(Encargado encargado);

    // Método para obtener un encargado por su ID
    public Optional<Encargado> obtenerEncargadoPorId(Long id);

    // Método para buscar un encargado por RFC
    public Optional<Encargado> buscarPorRFC(String RFC_CURP);

    // Método para eliminar un encargado
    void eliminarEncargado(Long idEncargado);
}
