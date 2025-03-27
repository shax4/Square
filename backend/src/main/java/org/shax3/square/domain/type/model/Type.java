package org.shax3.square.domain.type.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.shax3.square.domain.user.model.User;

import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Table(
        name = "type"
)
public class Type {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Type1 type1;

    @Column(nullable = false)
    private int score1;

    @Column(nullable = false)
    private Type1 type2;

    @Column(nullable = false)
    private int score2;

    @Column(nullable = false)
    private Type1 type3;

    @Column(nullable = false)
    private int score3;

    @Column(nullable = false)
    private Type1 type4;

    @Column(nullable = false)
    private int score4;


}
