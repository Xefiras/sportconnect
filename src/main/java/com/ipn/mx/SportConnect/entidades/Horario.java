package com.ipn.mx.SportConnect.entidades;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "Horario", schema = "public") // Especifica el nombre de la tabla correspondiente en la base de datos.
public class Horario implements Serializable {

    @Id // Define la clave primaria de la tabla.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Indica que el ID es auto-incremental.
    @Column(name = "id_horario") // Especifica el nombre exacto de la columna en la base de datos.
    private Long idHorario;
    @ManyToOne
    @JsonBackReference // Evita serializar al padre en el JSON
    @JoinColumn(name = "deportivo_id", referencedColumnName = "id_deportivo")
    private Deportivo deportivo;


    @Column(name = "dia_semana") // Relaciona esta propiedad con la columna "dia_semana".
    private String diaSemana;

    @Column(name = "hora_apertura", nullable = true) // Relaciona esta propiedad con la columna "hora_apertura".
    private LocalTime horaApertura;

    @Column(name = "hora_cierre", nullable = true) // Relaciona esta propiedad con la columna "hora_cierre".
    private LocalTime horaCierre;

    private boolean inhabil; // Esta columna se genera automáticamente a partir del nombre del atributo.
}
