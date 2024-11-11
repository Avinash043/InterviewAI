"use client";
import { db } from "@/utils/db.config";
import { InterviewAI } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";

function InterviewList() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  useEffect(() => {
    user && GetInterviewList();
  }, [user]);
  const GetInterviewList = async () => {
    const result = await db
      .select()
      .from(InterviewAI)
      .where(eq(InterviewAI.createdBy,user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(InterviewAI.id));

    console.log("result", result);
    setInterviewList(result);
  };
  return (
    <div>
      <h2 className="font-medium text-xl">Previous Interview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
        {interviewList && interviewList.map((interview,index)=>(
            <InterviewItemCard interview={interview} key={index}></InterviewItemCard>
        ))}
      </div>
    </div>
  );
}

export default InterviewList;
