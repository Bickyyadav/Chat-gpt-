"use client";
import axios from "axios";

import { PlaceholdersAndVanishInput } from "@/components/placeholders-and-vanish-input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function PlaceholdersAndVanishInputDemo() {
  const [input, setInput] = useState("");
  const placeholders = ["What Do You Want To Search ?", "Say Me your Problem"];
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      console.log(e.target.value);

      setInput(e.target.value);
    } catch (error) {
      console.log("🚀 ~ handleChange ~ error:", error);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem("question", input);
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/conversation`,
      { input }
    );
    
    toast.success(res.data.message);
    console.log("🚀 ~ onSubmit ~ res:", res.data.data.message);
    router.push(`/dashboard?id=${res.data.data.newConversation}`);
  };

  return (
    <div className="h-[40rem] flex flex-col justify-center  items-center px-4">
      <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
        Ask Your Dought Anytime
      </h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}

const Page = () => {
  return (
    <div className=" w-full h-full flex items-center justify-center  ">
      <PlaceholdersAndVanishInputDemo />
    </div>
  );
};

export default Page;
