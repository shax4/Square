package org.shax3.square.domain.like.model;

import org.shax3.square.common.entity.BaseTimeEntity;
import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.user.model.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "likes", uniqueConstraints = {
	@UniqueConstraint(name = "uk_user_target", columnNames = {"user_id", "target_type", "target_id"})
})
public class Like extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(nullable = false)
	private Long targetId;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private TargetType targetType;

	@Column(name = "is_like", nullable = false)
	private boolean like;

	@Builder
	public Like(User user, Long targetId, TargetType targetType) {
		this.user = user;
		this.targetId = targetId;
		this.targetType = targetType;
		this.like = true;
	}

	public void toggleLike() {
		this.like = !this.like;
	}
}
