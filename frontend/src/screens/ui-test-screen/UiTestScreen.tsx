import React from 'react';
import { View } from 'react-native';
import Button from '../../components/Button';

const UiTestScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* 활성화된 다음 버튼 */}
      <Button
        label="다음"
        onPress={() => console.log('활성화 버튼 클릭')}
      />

      {/* 비활성화된 다음 버튼 */}
      <Button
        label="다음"
        disabled
        onPress={() => console.log('비활성화 버튼 클릭')}
      />
    </View>
  );
};

export default UiTestScreen;
