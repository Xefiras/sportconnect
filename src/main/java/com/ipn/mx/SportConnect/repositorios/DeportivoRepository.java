package com.ipn.mx.SportConnect.repositorios;

import com.ipn.mx.SportConnect.entidades.Deportivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeportivoRepository extends JpaRepository<Deportivo, Long> {
    //Todos los métodos CRUD
    //Query para mostrar los deportivos asociados con el encargado, es decir, de aquellos los cual es encargado
    @Query("SELECT d FROM Deportivo d JOIN FETCH d.encargado e WHERE e.rfcCurp = :rfcCurp")
    List<Deportivo> findDeportivosByEncargado(@Param("rfcCurp") String rfcCurp);

}
