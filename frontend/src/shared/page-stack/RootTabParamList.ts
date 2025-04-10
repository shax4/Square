// shared/page-stack/RootTabParamList.ts

import { BoardStackParamList } from './BoardPageStack';
import { DebateStackParamList } from './DebatePageStack';
import { StackParamList as MyPageStackParamList } from './MyPageStack';
import { NotificationStackParamList } from './NotificationPageStack';

export type RootTabParamList = {
  게시판: {
    screen: keyof BoardStackParamList;
    params: BoardStackParamList[keyof BoardStackParamList];
  };
  '메인 홈': {
    screen: keyof DebateStackParamList;
    params: DebateStackParamList[keyof DebateStackParamList];
  };
  알림: {
    screen?: keyof NotificationStackParamList;
    params?: NotificationStackParamList[keyof NotificationStackParamList];
  };
  마이페이지: {
    screen?: keyof MyPageStackParamList;
    params?: MyPageStackParamList[keyof MyPageStackParamList];
  };
};
