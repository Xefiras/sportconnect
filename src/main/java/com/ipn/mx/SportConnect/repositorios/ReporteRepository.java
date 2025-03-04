package com.ipn.mx.SportConnect.repositorios;

import com.ipn.mx.SportConnect.entidades.Reporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReporteRepository extends JpaRepository<Reporte, Long> {
    //Todos los métodos queries y statements para la base de datos.
    //Los queries personalizados se hacen con JPQL (Java Persistence Query Language)
    @Query("SELECT r FROM Reporte r WHERE r.entidadAsociada = :entidad")
    List<Reporte> findReportesByEntidadAsociada(@Param("entidad") Reporte.EntidadAsociada entidad);
    //El @Param("entidad") hace referencia al parametro entidad que está dentro del @Query
    //Se usa Reporte.Entidad para utilizar el ENUM, que contiene solamente dos opciones, CANCHA y DEPORTIVO
    //Resultando más adecuado que solo usar String
}
