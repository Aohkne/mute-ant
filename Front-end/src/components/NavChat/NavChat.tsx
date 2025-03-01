// src/components/NavBar/NavBar.tsx
import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./NavChat.module.scss";
import { Menu } from "lucide-react";

const cx = classNames.bind(styles);

const historyData = [
  { role: "user", parts: "Xin chào, đây là lịch sử chat 1!" },
  { role: "model", parts: "Chào bạn! Mình là chatbot đây." },
  { role: "user", parts: "Lịch sử chat 2 có nội dung dài hơn một chút." },
  { role: "model", parts: "Mình hiểu rồi. Bạn cần giúp gì không?" },
  {
    role: "user",
    parts: "Lịch sử chat 3 với đoạn hội thoại dài hơn nữa để test giao diện.",
  },
];

interface NavBarProps {
  onSelectHistory: (index: number) => void;
}

const NavBar: React.FC<NavBarProps> = ({ onSelectHistory }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleNav = () => setIsOpen(!isOpen);

  return (
    <>
      {!isOpen && (
        <div className={cx("toggle")} onClick={toggleNav}>
          <Menu size={24} />
        </div>
      )}
      <nav className={cx("nav", { open: isOpen })}>
        <div className={cx("header-nav")}>
          <h2 className={cx("title", "text-title")}>Chat History</h2>

          <div className={cx("toggle-icon")} onClick={toggleNav}>
            <Menu size={24} />
          </div>
        </div>

        <ul className={cx("history-list")}>
          {historyData.map((item, index) => (
            <li
              key={index}
              className={cx("history-item")}
              onClick={() => onSelectHistory(index)}
            >
              {item.parts.slice(0, 30)}...
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
