// src/navigation/NavigationService.ts
import { createNavigationContainerRef } from '@react-navigation/native';
import { RootTabParamList } from '../../shared/page-stack/RootTabParamList';

export const navigationRef = createNavigationContainerRef<RootTabParamList>();

export function navigate<T extends keyof RootTabParamList>(
    name: T,
    params?: RootTabParamList[T]
  ): void {
    if (navigationRef.isReady()) {
      if (params) {
        navigationRef.navigate(name as any, params as any);
      } else {
        navigationRef.navigate(name as any);
      }
    }
  }
  
  