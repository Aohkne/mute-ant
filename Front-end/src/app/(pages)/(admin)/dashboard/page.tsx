"use client";

import Panel from "@/components/Panel/Panel";
import Sidebar from "@/components/Sidebar/Sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";

import styles from "./Dashboard.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import {
  HardDriveDownload,
  HardDriveUpload,
  LibraryBig,
  UsersRound,
} from "lucide-react";
import { ChartArea } from "@/components/Chart/ChartArea";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";

import { fetchUsers } from "@/redux/features/accounts";

import { fetchBlogs } from "@/redux/features/blogs";

import { fetchTotalMessages } from "@/redux/features/messages";

//Chart
const chartConfig = {
  conversation: { label: "Conversation", color: "hsl(var(--chart-1))" },
  // response: { label: "Responses", color: "hsl(var(--chart-2))" },
};

const chartData = [
  { date: "2024-11-01", conversation: 180 },
  { date: "2024-12-01", conversation: 220 },
  { date: "2025-01-01", conversation: 190 },
  { date: "2025-01-15", conversation: 250 },
  { date: "2025-02-01", conversation: 230 },
  { date: "2025-02-10", conversation: 270 },
  { date: "2025-02-20", conversation: 250 },
  { date: "2025-02-25", conversation: 350 },
  { date: "2025-02-25", conversation: 30 },
  { date: "2025-02-23", conversation: 300 },
];

function Dashbroad() {
  const dispatch = useDispatch<AppDispatch>();

  // GET User
  const { totalPages } = useSelector((state: RootState) => state.accounts);

  useEffect(() => {
    dispatch(
      fetchUsers({
        page: 0,
        size: 0,
        sort: ["id,asc"],
        gender: "",
        searchTerm: "",
      })
    );
  }, [dispatch]);

  // GET Blogs
  const { pagination } = useSelector((state: RootState) => state.blogs);
  const currentPage = 1;
  useEffect(() => {
    dispatch(fetchBlogs(currentPage - 1));
  }, [dispatch, currentPage]);

  // GET Request + Response
  const { request, response } = useSelector(
    (state: RootState) => state.dtoMessage
  );

  useEffect(() => {
    dispatch(fetchTotalMessages("user"));
    dispatch(fetchTotalMessages("model"));
  }, [dispatch]);

  return (
    <div className={cx("wrapper")}>
      <Sidebar />
      <div className={cx("title", "text-title")}>Dashboard</div>

      <div className={cx("content")}>
        <Panel
          type="user"
          title="Users"
          icon={<UsersRound size={30} />}
          total={totalPages}
        />
        <Panel
          type="blog"
          title="Blogs"
          icon={<LibraryBig size={30} />}
          total={pagination.totalPages}
        />
        <Panel
          type="request"
          title="Requests"
          icon={<HardDriveUpload size={30} />}
          total={request}
        />
        <Panel
          type="response"
          title="Response"
          icon={<HardDriveDownload size={30} />}
          total={response}
        />
      </div>

      <div className={cx("chart-container")}>
        <ChartArea
          data={chartData}
          config={chartConfig}
          title="Conversations"
          description="Mute Ant Bot."
        />
      </div>

      <div className={cx("fixed top-0 right-0 p-4")}>
        <ModeToggle />
      </div>
    </div>
  );
}

export default Dashbroad;
