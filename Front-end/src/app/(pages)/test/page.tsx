"use client";

import { useAppDispatch, useAppSelector } from "../../../hooks";
import { increment } from "../../../redux/features/counter/counterSlice";

const CounterComponent = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
    </div>
  );
};

export default CounterComponent;
