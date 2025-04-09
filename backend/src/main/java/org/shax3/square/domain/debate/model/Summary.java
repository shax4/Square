package org.shax3.square.domain.debate.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "summary")

public class Summary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "debate_id")
    private Debate debate;

    private String content;

    @Column(name = "is_left", nullable = false)
    private boolean left;

    @Builder
    public Summary(Debate debate, String content, boolean left) {
        this.debate = debate;
        this.content = content;
        this.left = left;
    }
}
