import TableUsers from "@/components/TableUsers/TableUsers";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Sidebar from "@/components/Sidebar/Sidebar";

import styles from "./Users.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function Users() {
  return (
    <div className={cx("wrapper")}>
      <Sidebar />
      <div className={cx("title", "text-title")}>Users</div>

      <TableUsers />

      <div className={cx("fixed top-0 right-0 p-4")}>
        <ModeToggle />
      </div>
    </div>
  );
}

export default Users;
