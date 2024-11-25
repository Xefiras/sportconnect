package com.ipn.mx.SportConnect.entidades;

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
@Table(name = "cancha", schema = "public")
public class Cancha implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_cancha;
   
    @Column(name = "deportivo_id", length = 100, nullable = false)
    private int deportivo_id;

    @Column(name = "tipo_cancha", length = 100, nullable = false)
    private String tipo_cancha;

    @Column(name = "numero_cancha", length = 100, nullable = false)
    private int numero_cancha;

    @Column(name = "material_piso", length = 100, nullable = false)
    private String material_piso;

    @Column(name = "tiene_techo", nullable = false)
    private Boolean tiene_techo;

    @Column(name = "tiene_gradas", nullable= false)
    private Boolean tiene_gradas;

    @Column(name= "estado", length = 100, nullable = false)
    private String estado;

    @Column(name = "capacidad_jugadores", length = 100, nullable = false)
    private int capacidad_jugadores;

    @Column(name = "coordenadas_cancha", length = 100, nullable = false)
    private String coordenadas_cancha;

    @Override
    public String toString(){
        return "Canchas{"+
                "id_canchas:" + id_cancha +
                "deportivo_id" + deportivo_id +
                "tipo_cancha" + tipo_cancha +
                "numero_chancha" + numero_cancha +
                "material_piso" + material_piso +
                "tiene_techo" + tiene_techo +
                "tiene_gradas" + tiene_gradas +
                "estado" + estado +
                "capacidad_jugadores" + capacidad_jugadores +
                "coordenadas_cancha" + coordenadas_cancha +
                '}';
                
    }
}