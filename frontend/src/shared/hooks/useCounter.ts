import { useCounterStore } from '../stores/counter';

export const useCounter = () => {
  const count = useCounterStore((state) => state.count);
  const increase = useCounterStore((state) => state.increase);
  const decrease = useCounterStore((state) => state.decrease);

  return { count, increase, decrease };
};
