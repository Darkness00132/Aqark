"use client";
import { ResponsiveLine } from "@nivo/line";

export interface User {
  createdAt: string;
}

interface DataPoint {
  x: string;
  y: number;
}

interface LineSeries {
  id: string;
  data: DataPoint[];
}

function prepareUserChartData(users: User[]): LineSeries[] {
  if (!users || users.length === 0) {
    // Show last 7 days with 0 users
    const data: DataPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        x: date.toISOString().split("T")[0],
        y: 0,
      });
    }
    return [{ id: "Users Registered", data }];
  }

  // Count users by date
  const countsByDate: Record<string, number> = {};
  let minDate: Date | undefined = undefined;
  let maxDate: Date | undefined = undefined;

  users.forEach((user) => {
    const date = new Date(user.createdAt);
    const dateStr = date.toISOString().split("T")[0];
    countsByDate[dateStr] = (countsByDate[dateStr] || 0) + 1;

    if (!minDate || date < minDate) minDate = date;
    if (!maxDate || date > maxDate) maxDate = date;
  });

  // If we only have data for one day, show a week range
  if (
    minDate &&
    maxDate &&
    (minDate as Date).toDateString() === (maxDate as Date).toDateString()
  ) {
    const weekBefore = new Date(minDate);
    weekBefore.setDate(weekBefore.getDate() - 3);
    const weekAfter = new Date(maxDate);
    weekAfter.setDate(weekAfter.getDate() + 3);
    minDate = weekBefore;
    maxDate = weekAfter;
  }

  // Fill in missing dates with 0 counts
  if (minDate && maxDate) {
    const currentDate = new Date(minDate);
    while (currentDate <= maxDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      if (!(dateStr in countsByDate)) {
        countsByDate[dateStr] = 0;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  // Convert to chart data
  const chartData: DataPoint[] = Object.entries(countsByDate)
    .map(([date, count]) => ({ x: date, y: count }))
    .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());

  return [{ id: "Users Registered", data: chartData }];
}

export default function UsersGrowthChart({ users }: { users: User[] }) {
  const data = prepareUserChartData(users);
  const totalUsers = users?.length || 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          User Registrations Over Time
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Total users:{" "}
          <span className="font-semibold text-gray-700">{totalUsers}</span>
        </p>
      </div>

      <div className="h-[350px]">
        <ResponsiveLine
          data={data}
          margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
          xScale={{
            type: "time",
            format: "%Y-%m-%d",
            precision: "day",
          }}
          xFormat="time:%Y-%m-%d"
          yScale={{
            type: "linear",
            min: 0,
            max: "auto",
            stacked: false,
          }}
          axisBottom={{
            format: "%b %d",
            tickValues: totalUsers <= 5 ? "every 1 day" : "every 2 days",
            legend: "Date",
            legendOffset: 45,
            legendPosition: "middle",
            tickRotation: -45,
          }}
          axisLeft={{
            legend: "Number of Users",
            legendOffset: -50,
            legendPosition: "middle",
            tickValues: 5,
          }}
          colors={["#3b82f6"]}
          pointSize={8}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          curve="monotoneX"
          enableArea={true}
          areaOpacity={0.1}
          enableGridX={false}
          enableGridY={true}
          theme={{
            text: {
              fill: "#374151",
              fontSize: 11,
              fontWeight: 500,
            },
            grid: {
              line: {
                stroke: "#e5e7eb",
                strokeWidth: 1,
              },
            },
            axis: {
              ticks: {
                text: { fill: "#6b7280" },
              },
              legend: {
                text: {
                  fill: "#374151",
                  fontSize: 12,
                  fontWeight: 600,
                },
              },
            },
            crosshair: {
              line: {
                stroke: "#3b82f6",
                strokeWidth: 1,
                strokeOpacity: 0.5,
              },
            },
          }}
          tooltip={({ point }) => (
            <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-gray-200">
              <div className="text-xs font-semibold text-gray-700">
                {new Date(point.data.x).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="text-sm font-bold text-blue-600 mt-1">
                {point.data.y} {point.data.y === 1 ? "user" : "users"}
              </div>
            </div>
          )}
          animate={true}
          motionConfig="gentle"
        />
      </div>

      {totalUsers === 0 && (
        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm italic">
            No registrations yet. Data will appear once users start signing up.
          </p>
        </div>
      )}
    </div>
  );
}
