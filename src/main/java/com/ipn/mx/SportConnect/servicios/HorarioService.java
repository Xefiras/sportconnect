package com.ipn.mx.SportConnect.servicios;

import com.ipn.mx.SportConnect.entidades.Horario;
import java.util.List;
import java.util.Optional;

public interface HorarioService {

    List<Horario> obtenerHorarios();

    // Método para obtener los horarios por ID de deportivo
    List<Horario> obtenerHorariosPorDeportivo(int deportivoid);

    // Método para guardar un nuevo horario
    Horario guardarHorario(Horario horario);

    Optional<Horario> obtenerHorarioPorId(long horarioId);
}
