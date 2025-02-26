package com.ipn.mx.SportConnect.entidades;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table (name = "Direccion", schema = "public") //Se pone el esquema público en donde se ubican las bases de datos en postgreSQL
public class Direccion implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_direccion")
    private int idDireccion;

    @OneToOne
    @JsonBackReference // Evita serializar al padre en el JSON
    //deportivo_id es el nombre de la columna de la tabla dirección, mientras que id_deportivo es el nombre de la tabla deportivo
    @JoinColumn(name = "deportivo_id", referencedColumnName = "id_deportivo", nullable = false)
    private Deportivo deportivo;

    @Column(name = "calle", /*length = 255, es redundante*/ nullable = false)
    private String calle;

    @Column(name = "alcaldia", length = 100, nullable = false)
    private String alcaldia;

    @Column(name = "codigo_postal", length = 20, nullable = false)
    private String codigoPostal;

    @Column(name = "coordenadas_direccion", length = 100, nullable = false)
    private String coords;

    @Column(name = "referencias", nullable = false)
    private String referencias;

    @Column(name = "entre_calle1", length = 100, nullable = false)
    private String entre_calle1;

    @Column(name = "entre_calle2", length = 100, nullable = false)
    private String entre_calle2;


    @Override
    public String toString(){
        return "Direccion{" +
                "id_direccion:" + idDireccion +
                "deportivo_id:" + deportivo.getIdDeportivo() +
                "calle: " + calle +
                "alcaldia: " + alcaldia +
                "codigo_postal: " + codigoPostal +
                "coordenadas_direccion: " + coords +
                "referencias: " + referencias +
                "entre_calle1: " + entre_calle1 +
                "entre_calle2: " + entre_calle2 +
                '}';
    }
}