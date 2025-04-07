import { Text as RNText, TextProps, StyleSheet } from 'react-native';

interface CustomTextProps extends TextProps {
  weight?: 'bold' | 'medium';
}

const fontMap = {
  bold: 'Pretendard-Bold',
  medium: 'Pretendard-Medium',
};

export default function Text({ weight = 'bold', style, ...props }: CustomTextProps) {
  return (
    <RNText
      {...props}
      style={[styles.default, { fontFamily: fontMap[weight] }, style]}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    color: '#000',
  },
});
