"use client";
import React, { useEffect, useState } from "react";

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import axios from "axios";
import { useSearchParams } from "next/navigation";

const AppSidebar = () => {
  const [data, setData] = useState([]);

  const searchParams = useSearchParams();
  const conversationId = searchParams.get("id");
  useEffect(() => {
    async function allConversation() {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/getAllMessage`,
          { conversationId }
        );
        setData(res.data.allMessage);
      } catch (error) {
        console.log("🚀 ~ allConversation ~ error:", error);
      }
    }
    allConversation();
  }, []);

  return (
    <div>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {data
                  .filter((msg) => msg.Role === "user")
                  .map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton asChild>
                        {/* <a href={item.url}> */}
                        {/* <item.icon /> */}
                        <span>{item.content}</span>
                        {/* </a> */}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
};

export default AppSidebar;
