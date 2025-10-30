"use client";
import { Button } from "@/components/ui/button";
import { AskAi } from "./AskAi";
import { testFunction } from "./actions";

const Playground = () => {

  const clickHandler = async () => {
    console.log("clicked");
    await testFunction();
    console.log("clicked2");
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 p-6 gap-6 min-h-screen overscroll-y-auto">
      <AskAi />
      <div className="border-2  rounded-sm p-4 text-center"></div>
      <div className="border-2  rounded-sm p-4 text-center"></div>
      <div className="border-2  rounded-sm p-4 text-center"></div>
      <Button onClick={clickHandler}>Test</Button>
    </div>
  );
};

export default Playground;
