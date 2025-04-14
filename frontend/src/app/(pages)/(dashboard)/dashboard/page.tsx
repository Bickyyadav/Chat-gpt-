"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

import { PlaceholdersAndVanishInput } from "@/components/placeholders-and-vanish-input";

function PlaceholdersAndVanishInputDemo() {
  const [item, setItem] = useState([]);
  console.log("🚀 ~ PlaceholdersAndVanishInputDemo ~ item:", item);
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("id");

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/getAllMessage`,
        {
          conversationId,
        }
      );
      setItem(res.data);
      console.log("🚀 ~ useEffect ~ res:", res.data.allMessage);
    };

    fetchData();
  }, []);

  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="h-full pb-4 flex flex-col justify-end  items-end ">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}

const page = () => {
  return (
    <div className="w-full h-full bottom-0">

      <PlaceholdersAndVanishInputDemo />
    </div>
  );
};

export default page;
