import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";

// Custom hook giúp sử dụng dispatch mà không cần khai báo kiểu dữ liệu mỗi lần
export const useAppDispatch = () => useDispatch<AppDispatch>();
