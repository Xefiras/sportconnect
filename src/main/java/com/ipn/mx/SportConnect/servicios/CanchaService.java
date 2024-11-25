package com.ipn.mx.SportConnect.servicios;

import com.ipn.mx.SportConnect.entidades.Cancha;
import java.util.List;

public interface CanchaService {
    void crearCancha(Cancha cancha);
    Cancha obtenerCancha(int idCancha);
    List<Cancha> obtenerCanchas();
    void updateCancha(Cancha cancha);
    void eliminarCancha(int idCancha);
}