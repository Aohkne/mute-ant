import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  fetchConversations,
  fetchMessages,
} from "@/redux/features/conversation/conversationSlice";

import classNames from "classnames/bind";
import styles from "./NavChat.module.scss";
const cx = classNames.bind(styles);

interface NavBarProps {
  onSelectHistory: (id: number) => void;
}

const NavBar: React.FC<NavBarProps> = ({ onSelectHistory }) => {
  const [isOpen, setIsOpen] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const { conversations, messages, loading } = useSelector(
    (state: RootState) => state.conversations
  );

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    conversations.forEach((conversation: any) => {
      if (!messages[conversation.id]) {
        dispatch(fetchMessages(conversation.id));
      }
    });
  }, [dispatch, conversations.length, messages]);

  const toggleNav = () => setIsOpen(!isOpen);

  return (
    <>
      {!loading && !isOpen && (
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
          {conversations.map((conversation: any, index: number) => {
            const messageList = messages[conversation.id] || [];
            const firstMessage =
              messageList.length > 0 ? messageList[0].messageText : null;

            return firstMessage ? (
              <li
                key={index}
                className={cx("history-item")}
                onClick={() => onSelectHistory(conversation.id)}
              >
                {firstMessage.length > 20
                  ? `${firstMessage.slice(0, 20)}...`
                  : firstMessage}
              </li>
            ) : null;
          })}
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
