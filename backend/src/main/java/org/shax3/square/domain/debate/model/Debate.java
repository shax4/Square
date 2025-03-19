package org.shax3.square.domain.debate.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "debate")
public class Debate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String Topic;

    @Column(name ="is_valid",nullable = false)
    private boolean valid;

    @Column (nullable = false)
    private String leftOption;

    @Column (nullable = false)
    private String rightOption;

    @Builder
    public Debate(String topic, String leftOption, String rightOption) {
        this.Topic = topic;
        this.leftOption = leftOption;
        this.rightOption = rightOption;
        this.valid = true;
    }
}
