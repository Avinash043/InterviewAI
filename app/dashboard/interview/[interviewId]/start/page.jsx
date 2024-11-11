"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db.config";
import { InterviewAI } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Questions from "./_components/Questions";
import RecordAnswer from "./_components/RecordAnswer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from 'next/navigation';

function StartInterview() {
  const [interviewData, setInterviewData] = useState([]);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const params = useParams();
  const interviewId = params.interviewId;
  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db.select().from(InterviewAI).where(eq(InterviewAI.mockId,interviewId));
    console.log("result",(result[0].jsonMockResp));

    const jsonMockResp = JSON.parse(result[0].jsonMockResp)
    console.log("question",jsonMockResp);
    setInterviewQuestions(jsonMockResp);
    setInterviewData(result[0]);

    console.log("ques",interviewQuestions)

  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Questions
          interviewQuestions={interviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
        />
        <RecordAnswer
          interviewQuestions={interviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>
      <div className="flex justify-end gap-6">
        {activeQuestionIndex > 0 && 
          <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
        {activeQuestionIndex != interviewQuestions?.length - 1 && (
          <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>
        )}
        {activeQuestionIndex == interviewQuestions?.length - 1 && 
          <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}>
            <Button >End Interview</Button>
          </Link>
          
        }
      </div>
    </div>
  );
}

export default StartInterview;
