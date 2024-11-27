import styles from "./Assistant.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

function Assistant() {
  return (
    <div>
      <div className={cx("px-10")}>
        <Header />
      </div>

      <div className={cx("wrapper", "p-10")}>
        <div className={cx("title", "my-5")}>
          <div className={cx("text-gradient-3")}>Communication</div>
        </div>
        {/* Content */}
      </div>

      <Footer />
    </div>
  );
}

export default Assistant;
