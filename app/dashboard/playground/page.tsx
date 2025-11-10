"use client";
import { AskAi } from "./AskAi";
import RunCampaign from "./RunCampaign";

const Playground = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 p-6 gap-6 min-h-screen overscroll-y-auto">
      <AskAi />
      <div className="border-2  rounded-sm p-4 text-center"></div>
      <div className="border-2  rounded-sm p-4 text-center"></div>
      <RunCampaign />
    </div>
  );
};

export default Playground;
