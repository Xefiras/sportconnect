package com.ipn.mx.SportConnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

 // Esta anotación incluye @Configuration, @EnableAutoConfiguration y @ComponentScan
@SpringBootApplication(scanBasePackages = "com.ipn.mx.SportConnect")
public class SportConnectApplication {
//Si se quisiera implementar código aquí (códigos de prueba), se tiene que crear el método run
    //e implementar el CommandLineRunner
    public static void main(String[] args) {
        SpringApplication.run(SportConnectApplication.class, args);
    }
}
