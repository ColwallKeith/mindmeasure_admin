import { useState } from "react";
import { NetworkLayout } from "./components/NetworkLayout";
import { SuperuserControlPanel } from "./components/SuperuserControlPanel";

export default function NetworkApp() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <NetworkLayout
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
    >
      <SuperuserControlPanel />
    </NetworkLayout>
  );
}