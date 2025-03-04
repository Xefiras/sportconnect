package com.ipn.mx.SportConnect.servicios.impl;
import com.ipn.mx.SportConnect.entidades.Cancha;
import com.ipn.mx.SportConnect.repositorios.CanchaRepository;
import com.ipn.mx.SportConnect.servicios.CanchaService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
//La implementacion es la que lleva la anotacion @Service y @AutoWired, la interfaz no los lleva

@Service
public class CanchaServiceImpl implements CanchaService{
    @Autowired
    private CanchaRepository canchaRepository;

    @Override
    @Transactional
    public void crearCancha(Cancha cancha) {
        canchaRepository.save(cancha);
    }

    @Override
    public Cancha obtenerCancha(Long idCancha) {
        return canchaRepository.findById(idCancha).orElse(null);
    }

    @Override
    public List<Cancha> obtenerCanchas() {
        return canchaRepository.findAll();
    }

    @Override
    public void updateCancha(Cancha cancha) {
        canchaRepository.save(cancha);
    }

    @Override
    public void eliminarCancha(Long idCancha) {
        canchaRepository.deleteById(idCancha);
    }
}