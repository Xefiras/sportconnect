package com.ipn.mx.SportConnect.repositorios;

import com.ipn.mx.SportConnect.entidades.Cancha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CanchaRepository extends
JpaRepository<Cancha, Integer> {
    //Todos los metodos CRUD
}