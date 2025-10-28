"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { testFunction } from "./actions";

const Playground = () => {
  const handleClick = async () => {
    // await testFunction(inputText);
  }

  const [inputText, setInputText] = useState();
  return (
    <div>
      <Input />
      <Button onClick={testFunction}>Test</Button>
    </div>
  );
};

export default Playground;
