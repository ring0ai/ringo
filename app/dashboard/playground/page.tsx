"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Playground = () => {
  const [inputText, setInputText] = useState();
  return (
    <div>
      <Input />
    </div>
  );
};

export default Playground;
