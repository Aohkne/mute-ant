import { TypedUseSelectorHook, useSelector } from "react-redux";
import type { RootState } from "../redux/store";

// Custom hook giúp sử dụng selector mà không cần khai báo kiểu dữ liệu mỗi lần
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
