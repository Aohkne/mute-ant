import styles from "./User.module.scss";
import classNames from "classnames/bind";
import Image from "next/image";
const cx = classNames.bind(styles);

interface UserData {
  img: string;
  fullname: string;
  username: string;
  gmail: string;
  birthday: string;
  gender: string;
}

function User({ data }: { data: UserData }) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("content")}>
        <div className={cx("header")}>
          <div className={cx("img-container")}>
            <Image
              className={cx("img")}
              src={data.img || "/images/img/default-user.png"}
              width={100}
              height={100}
              alt="user-img"
            />
          </div>

          <div className={cx("fullname")}>
            {data.fullname}
            <div className={cx("username")}>@{data.username}</div>
          </div>
        </div>

        <div className={cx("info-user")}>
          <div className={cx("info-title")}>
            Gmail:
            <span>{data.gmail}</span>
          </div>

          <div className={cx("info-title")}>
            Num:
            <span>{"090xxxxxx"}</span>
          </div>

          <div className={cx("info-title")}>
            DOB:
            <span>{data.birthday}</span>
          </div>

          <div className={cx("info-title")}>
            Gender:
            <span>{data.gender}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
