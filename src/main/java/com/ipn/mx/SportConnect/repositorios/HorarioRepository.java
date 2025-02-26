package com.ipn.mx.SportConnect.repositorios;

import com.ipn.mx.SportConnect.entidades.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HorarioRepository extends JpaRepository<Horario, Long> {

    // Cambia "idDeportivo" por "deportivo" para usar la relación ManyToOne correctamente
    //donde deportivo es la relacion OneToMany y IdDeportivo es la propiedad dentro de la entidad deportivo (nombre de la variable que hace referencia a la columna)
    List<Horario> findByDeportivo_IdDeportivo(int idDeportivo);

}
