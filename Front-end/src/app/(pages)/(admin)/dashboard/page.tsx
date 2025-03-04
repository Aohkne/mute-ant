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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";

import { fetchUsers } from "@/redux/features/accounts";
import { fetchBlogs } from "@/redux/features/blogs";
import { fetchTotalMessages } from "@/redux/features/messages";
import { fetchConversationStats } from "@/redux/features/conversation/conversationStatsSlice";
import dayjs from "dayjs";

// Chart config
const chartConfig = {
  conversation: { label: "Conversation", color: "hsl(var(--chart-1))" },
};

function Dashbroad() {
  const dispatch = useDispatch<AppDispatch>();
  const [mergedData, setMergedData] = useState<Record<string, number>>({});

  const chartData = Object.entries(mergedData).map(([date, value]) => ({
    date,
    conversation: value,
  }));

  // GET Users
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

  // GET data of Request + Response last 3 months
  useEffect(() => {
    const fetchDataForLast3Months = async () => {
      const today = dayjs();
      const aggregatedData: Record<string, number> = {};

      for (let i = 0; i < 3; i++) {
        const date = today.subtract(i, "month");
        const year = date.year();
        const month = date.month() + 1;

        try {
          const result = await dispatch(
            fetchConversationStats({ year, month })
          ).unwrap();

          if (result?.dailyBreakdown) {
            Object.entries(result.dailyBreakdown).forEach(([date, count]) => {
              aggregatedData[date] =
                (aggregatedData[date] || 0) + (count as number);
            });
          }
        } catch (error) {
          console.error("Error fetching conversation stats:", error);
        }
      }

      setMergedData(aggregatedData);
    };

    fetchDataForLast3Months();
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
          description="Conversation stats for the last 3 months"
        />
      </div>

      <div className={cx("fixed top-0 right-0 p-4")}>
        <ModeToggle />
      </div>
    </div>
  );
}

export default Dashbroad;
