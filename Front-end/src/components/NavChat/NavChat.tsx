import React, { useEffect, useState, useRef } from "react";
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

interface Conversation {
  id: number;
  title?: string;
}

interface NavBarProps {
  onSelectHistory: (id: number) => void;
}

const NavBar: React.FC<NavBarProps> = ({ onSelectHistory }) => {
  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  const hasFetchedMessages = useRef(new Set<number>());

  const { conversations, messages, loading } = useSelector(
    (state: RootState) => ({
      conversations: state.conversations.conversations as Conversation[],
      messages: state.conversations.messages as Record<
        number,
        { messageText: string }[]
      >,
      loading: state.conversations.loading,
    })
  );

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch, messages]);

  useEffect(() => {
    conversations.forEach((conversation) => {
      if (!hasFetchedMessages.current.has(conversation.id)) {
        dispatch(fetchMessages(conversation.id));
        hasFetchedMessages.current.add(conversation.id);
      }
    });
  }, [dispatch, conversations, messages]);

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
          {conversations.map((conversation) => {
            const messageList = messages[conversation.id] || [];
            const latestMessage =
              messageList.length > 0
                ? messageList[messageList.length - 1].messageText
                : null;

            return latestMessage ? (
              <li
                key={conversation.id}
                className={cx("history-item")}
                onClick={() => onSelectHistory(conversation.id)}
              >
                {latestMessage.length > 20
                  ? `${latestMessage.slice(0, 20)}...`
                  : latestMessage}
              </li>
            ) : null;
          })}
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
