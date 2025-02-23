import styles from "./Panel.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

interface Props {
  type: "user" | "blog" | "request" | "response";
  title: string;
  icon: React.ReactNode;
  total: number;
}

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};

function Panel({ type, title, icon, total }: Props) {
  return (
    <div className={cx("wrapper", type)}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <div className={cx("icon")}>{icon}</div>
          <h2 className={cx("title")}>{title}</h2>
        </div>
        <span className={cx("total")}>{formatNumber(total)}</span>{" "}
      </div>
    </div>
  );
}

export default Panel;
