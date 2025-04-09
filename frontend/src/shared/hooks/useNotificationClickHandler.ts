import { useEffect } from 'react';
import notifee, { EventType } from '@notifee/react-native';
import { navigationRef } from '../../app/navigation/NavigationService';

export const useNotificationClickHandler = () => {
  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS && detail.pressAction?.id === 'navigate') {
        const { type, targetId, debateId } = detail.notification?.data || {};

        console.log('[알림 클릭 감지]', type, targetId, debateId);

        if (!navigationRef.isReady()) return;

        switch (type) {
          case 'POST_COMMENT':
            if (targetId) {
              navigationRef.navigate('게시판', {
                screen: 'BoardDetail',
                params: { boardId: Number(targetId) },
              });
            }
            break;

          case 'TODAY_DEBATE':
            navigationRef.navigate('메인 홈', {
                screen: 'DebateCardsScreen',
                params: undefined,
            });
            break;

          case 'DEBATE_COMMENT':
            if (targetId && debateId) {
              navigationRef.navigate('메인 홈', {
                screen: 'OpinionDetailScreen',
                params: {
                  opinionId: Number(targetId),
                  debateId: Number(debateId),
                },
              });
            }
            break;

          case 'NOTICE':
            navigationRef.navigate('알림', {
              screen: 'NotificationScreen',
            });
            break;

          default:
            console.warn('알림 클릭: 알 수 없는 type:', type);
        }
      }
    });

    return unsubscribe;
  }, []);
};
