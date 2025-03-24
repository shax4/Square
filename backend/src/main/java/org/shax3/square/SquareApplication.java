package org.shax3.square;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SquareApplication {

    public static void main(String[] args) {
        SpringApplication.run(SquareApplication.class, args);
    }

}
