import { CounterState } from "./counterTypes";
import { store } from "../../redux/store";

declare module "@reduxjs/toolkit" {
  interface RootState {
    counter: CounterState;
  }

  type AppDispatch = typeof store.dispatch;
}
