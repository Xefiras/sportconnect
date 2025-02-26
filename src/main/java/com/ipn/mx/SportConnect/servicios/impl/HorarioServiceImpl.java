package com.ipn.mx.SportConnect.servicios.impl;

import com.ipn.mx.SportConnect.entidades.Horario;
import com.ipn.mx.SportConnect.repositorios.HorarioRepository;
import com.ipn.mx.SportConnect.servicios.HorarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service // Marca esta clase como un componente de servicio en Spring.
public class HorarioServiceImpl implements HorarioService {

    @Autowired // Inyecta la dependencia del repositorio de Horarios.
    private HorarioRepository horarioRepository;

    @Override
    public List<Horario> obtenerHorarios() {
        return horarioRepository.findAll();
    }

    public List<Horario> obtenerHorariosPorDeportivo(int deportivoid) {
        return horarioRepository.findByDeportivo_IdDeportivo(deportivoid);
    }

    public Optional<Horario> obtenerHorarioPorId(long horarioid) {
        return horarioRepository.findById(horarioid);
    }

    public Horario guardarHorario(Horario horario) {
        return horarioRepository.save(horario);
    }
}
