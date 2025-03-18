package org.shax3.square.domain.debate.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.shax3.square.domain.user.model.*;

import static jakarta.persistence.EnumType.STRING;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "vote")
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "debate_id")
    private Debate debate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(STRING)
    @Column(name = "region", nullable = false)
    private Region region;

    @Enumerated(STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Enumerated(STRING)
    @Column(name = "age_range", nullable = false)
    private AgeRange ageRange;

    @Enumerated(STRING)
    @Column(name = "religion", nullable = false)
    private Religion religion;

    @Enumerated(STRING)
    @Column(name = "type")
    private Type type;

    @Column(nullable = false)
    private boolean isLeft;

}
