import { AuthState } from "./authTypes";
// import { store } from "../../redux/store";

declare module "@reduxjs/toolkit" {
  interface RootState {
    auth: AuthState;
  }
}
