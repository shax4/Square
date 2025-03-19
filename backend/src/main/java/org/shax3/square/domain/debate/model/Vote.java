package org.shax3.square.domain.debate.model;

import jakarta.persistence.*;
import lombok.*;
import org.shax3.square.domain.user.model.*;

import static jakarta.persistence.EnumType.STRING;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
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

    @Column(name = "is_left", nullable = false) // 명시적으로 컬럼 이름 지정
    private boolean left;


    @Builder
    public Vote(Debate debate, User user, Region region, Gender gender, AgeRange ageRange, Religion religion, Type type, boolean left) {
        this.debate = debate;
        this.user = user;
        this.region = region;
        this.gender = gender;
        this.ageRange = ageRange;
        this.religion = religion;
        this.type = type;
        this.left = left;
    }
}

