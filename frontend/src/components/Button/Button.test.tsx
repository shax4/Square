import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from './Button';

describe('Button Component', () => {
  it('renders label correctly', () => {
    const { getByText } = render(<Button label="다음" />);
    expect(getByText('다음')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button label="다음" onPress={onPressMock} />);
    fireEvent.press(getByText('다음'));
    expect(onPressMock).toHaveBeenCalled();
  });

  it('does not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button label="완료" disabled={true} onPress={onPressMock} />,
    );
    fireEvent.press(getByText('완료'));
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
