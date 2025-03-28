import { View, Text, Button } from 'react-native';
import { useCounter } from '../../shared/hooks/useCounter';

export default function CounterComponent() {
  const { count, increase, decrease } = useCounter();

  return (
    <View>
      <Text>Count: {count}</Text>
      <Button title="Increase" onPress={increase} />
      <Button title="Decrease" onPress={decrease} />
    </View>
  );
}
