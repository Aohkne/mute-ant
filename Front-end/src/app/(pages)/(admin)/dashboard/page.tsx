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

//Chart
const chartConfig = {
  request: { label: "Requests", color: "hsl(var(--chart-1))" },
  response: { label: "Responses", color: "hsl(var(--chart-2))" },
};

const chartData = [
  { date: "2024-11-01", request: 180, response: 140 },
  { date: "2024-12-01", request: 220, response: 160 },
  { date: "2025-01-01", request: 190, response: 180 },
  { date: "2025-01-15", request: 250, response: 200 },
  { date: "2025-02-01", request: 230, response: 190 },
  { date: "2025-02-10", request: 270, response: 210 },
  { date: "2025-02-20", request: 250, response: 180 },
  { date: "2025-02-25", request: 350, response: 180 },
  { date: "2025-02-25", request: 30, response: 180 },
  { date: "2025-02-23", request: 300, response: 220 },
];

function Dashbroad() {
  return (
    <div className={cx("wrapper")}>
      <Sidebar />
      <div className={cx("title", "text-title")}>Dashboard</div>

      <div className={cx("content")}>
        <Panel
          type="user"
          title="Users"
          icon={<UsersRound size={30} />}
          total={120}
        />
        <Panel
          type="blog"
          title="Blogs"
          icon={<LibraryBig size={30} />}
          total={10}
        />
        <Panel
          type="request"
          title="Requests"
          icon={<HardDriveUpload size={30} />}
          total={1000}
        />
        <Panel
          type="response"
          title="Response"
          icon={<HardDriveDownload size={30} />}
          total={12000}
        />
      </div>

      <div className={cx("chart-container")}>
        <ChartArea
          data={chartData}
          config={chartConfig}
          title="Request - Response"
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
