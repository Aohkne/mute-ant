"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import styles from "./ChartArea.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

interface ChartData {
  date: string;
  [key: string]: string | number;
}

interface ConfigItem {
  color: string;
}

interface ChartAreaProps {
  data: ChartData[];
  config: Record<string, ConfigItem>;
  title: string;
  description: string;
}

export function ChartArea({
  data,
  config,
  title,
  description,
}: ChartAreaProps) {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return date >= startDate;
  });

  return (
    <Card className={cx("wrapper")}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-[40px] font-light sm:text-[45px]">
            {title}
          </CardTitle>
          <CardDescription className="text-[20px] font-light sm:text-[22px]">
            {description}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto text-[30px] font-light">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl text-[25px] font-light">
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData}>
              <defs>
                {Object.keys(config).map((key) => (
                  <linearGradient
                    key={key}
                    id={`fill${key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={config[key].color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={config[key].color}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                className={cx("X-axis")}
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return d.toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                className={cx("Y-axis")}
              />
              {Object.keys(config).map((key) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={config[key].color}
                  fill={`url(#fill${key})`}
                  strokeWidth={2}
                  className={cx("tag-name")}
                />
              ))}
              <Tooltip
                contentStyle={{
                  fontSize: "30px",
                  fontWeight: "600",
                  color: "var(--black)",
                }}
                itemStyle={{ fontSize: "20px", fontWeight: "500" }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: "30px",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
