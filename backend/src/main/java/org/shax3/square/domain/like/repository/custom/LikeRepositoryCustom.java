package org.shax3.square.domain.like.repository.custom;

import java.util.List;
import java.util.Set;

import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.user.model.User;

public interface LikeRepositoryCustom {
	Set<Long> findLikedTargetIds(User user, TargetType targetType, List<Long> targetIds);
}
