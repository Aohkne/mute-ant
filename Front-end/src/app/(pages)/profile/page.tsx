import { ModeToggle } from "@/components/ui/mode-toggle";
import Sidebar from "@/components/Sidebar/Sidebar";
import User from "@/components/User/User";

import styles from "./Profile.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

const user = {
  img: "",
  fullname: "user",
  username: "username",
  gmail: "user@gmail.com",
  birthday: "2004-02-02",
  gender: "female",
};

const admin = {
  img: "",
  fullname: "admin",
  username: "admin",
  gmail: "muteant.pro@gmail.com",
  birthday: "2004-02-21",
  gender: "male",
};

function Profile() {
  return (
    <div className={cx("wrapper")}>
      <Sidebar />

      <User data={admin} />

      <div className={cx("fixed top-0 right-0 p-4")}>
        <ModeToggle />
      </div>
    </div>
  );
}

export default Profile;
