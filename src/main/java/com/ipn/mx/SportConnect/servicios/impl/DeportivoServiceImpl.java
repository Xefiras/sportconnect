package com.ipn.mx.SportConnect.servicios.impl;

import com.ipn.mx.SportConnect.entidades.Deportivo;
import com.ipn.mx.SportConnect.repositorios.DeportivoRepository;
import com.ipn.mx.SportConnect.servicios.DeportivoService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
//La implementación es la que lleva la anotación @Service y @Autowired, la interfaz no los lleva
@Service
public class DeportivoServiceImpl implements DeportivoService {

    /*@Autowired
    private CanchaRepository canchaRepository;

    @Autowired
    private EncargadoRepository encargadoRepository;

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private DireccionRepository direccionRepository;*/

    @Autowired
    private DeportivoRepository deportivoRepository;

    @Override
    @Transactional
    public Deportivo crearDeportivo(Deportivo deportivo) {
        return deportivoRepository.save(deportivo);
    }

    @Override
    public Deportivo obtenerDeportivo(Long idDeportivo) {
        return deportivoRepository.findById(idDeportivo).orElse(null);
    }

    @Override
    public List<Deportivo> obtenerDeportivos() {
        return deportivoRepository.findAll();
    }

    @Override
    public void updateDeportivo(Deportivo deportivo) {
        deportivoRepository.save(deportivo);
    }

    @Override
    public void eliminarDeportivo(Long idDeportivo) {
        deportivoRepository.deleteById(idDeportivo);
    }

    @Override
    public List<Deportivo> getDeportivosByEncargado(String rfcCurp) {
        return deportivoRepository.findDeportivosByEncargado(rfcCurp);
    }
}
