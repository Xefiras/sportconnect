package com.ipn.mx.SportConnect.entidades;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
//TO DO usar camelCase para Java
@Data //Para generar getters, setters, toString, y constructor sin argumentos
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="reportes", schema = "public")
//Se implementa Serializable en las entidades o DTOS para que estos se puedan almacenar y transmitir adecuadamente.
public class Reporte  implements Serializable {

    public enum EntidadAsociada {
        DEPORTIVO, CANCHA
    }

    public enum TipoReporte {
        QUEJA, SUGERENCIA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reporte")
    private Long idReporte;

    @Column(name = "nombre_interesado", nullable = false)
    private String nombreInteresado;

    @Column(name = "primer_apellido_interesado", nullable = false)
    private String primerApellidoInteresado;

    @Column(name = "segundo_apellido_interesado", nullable = false)
    private String segundoApellidoInteresado;

    @Column(name = "correo_electronico_interesado", nullable = false)
    private String correoElectronicoInteresado;

    @Column(name = "tipo_reporte", nullable = false)
    private TipoReporte tipoReporte; //true si es queja, false si es sugerencia

    @Enumerated(EnumType.STRING)
    @Column(name = "enidad_asociada", nullable = false)
    private EntidadAsociada entidadAsociada; //Si el reporte es sobre una cancha o deportivo

    @Column(name = "titulo_reporte", nullable = false)
    private String tituloReporte;

    @Column(name = "numero_cancha", nullable = false)
    private String numeroCancha;

    @Column(name = "descripcion_reporte", nullable = false)
    private String descripcionReporte;

    @Column(name = "fecha_identificacion", nullable = false)
    private LocalDate fechaIdentificacion;

    @Column(name = "hora_identificacion", nullable = false)
    private LocalTime horaIdentificacion;

    @ManyToOne
    @JoinColumn(name = "deportivo_id", referencedColumnName = "id_deportivo", nullable = true) //Nombre de la columna en la tabla de Reportes y nombre de la columna en la tabla Deportivos
    @JsonBackReference
    private Deportivo deportivo;

    @ManyToOne
    @JoinColumn(name = "cancha_id", referencedColumnName = "id_cancha", nullable = true)
    @JsonBackReference
    private Cancha cancha;

    @Override
    //Si quiero imprimir las caracteristicas del objeto, lo invoco en un sysout.
    public String toString() {
        return "Reporte{" +
        "idReporte: " + idReporte +
                "nombreInteresado: " + nombreInteresado +
                "primerApellidoInteresado: " + primerApellidoInteresado +
                "segundoApellidoInteresado: " + segundoApellidoInteresado +
                "correoElectronicoInteresado: " + correoElectronicoInteresado +
                "tipoReporte: " + tipoReporte +
                "entidadAsociada: " + entidadAsociada +
                "tituloReporte: " + tituloReporte +
                "numeroCancha: " + numeroCancha +
                "descripcionReporte: " + descripcionReporte +
                "fechaIdentificacion: " + fechaIdentificacion +
                "horaIdentificacion: " + horaIdentificacion +
                "deportivo_relacionado: " + (deportivo != null ? deportivo.getIdDeportivo() : "N/A") +
                "cancha_relacionada: " + (cancha != null ? cancha.getId_cancha() : "N/A") +
                '}';

    }
}
