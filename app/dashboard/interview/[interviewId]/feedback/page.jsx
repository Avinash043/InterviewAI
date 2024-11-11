"use client";

import { db } from "@/utils/db.config";
import { eq } from "drizzle-orm";
import { UserAnswer } from "@/utils/schema";
// import { useParams } from 'next/navigation'
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useParams } from 'next/navigation';

function Feedback() {
    const route=useRouter()
    const params = useParams();
    const interviewId = params.interviewId;
    const [feedbackList, setFeedbackList] = useState([]);
    const averageRating = feedbackList.reduce((sum, item) => sum + parseFloat(item.rating), 0) / feedbackList.length;

    console.log("avg",averageRating);

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, interviewId))
      .orderBy(UserAnswer.id);
    console.log("result",result)
    setFeedbackList(result);
    
  };
  console.log("feedback",feedbackList);
  return (
    <div className="p-10">
      

      {feedbackList?.length == 0 ? 
       <h2 className="font-bold text-xl text-gray-500">No interview feedback found</h2>
       :<>
       <h2 className="text-3xl font-bold text-green-500">Congratulations !!!</h2>
       <h2 className="font-bold text-2xl">Here is your interview feedback</h2>
       <h2 className="text-primary text-lg my-3">
        Your overall interview rating: <strong>{averageRating}/10</strong>
      </h2>
       
      

      <h2 className="text-sm text-gray-500">
        Find below interview question with correct answer, Your answer and
        feedback for improvement
      </h2>

      {feedbackList &&
        feedbackList.map((item, index) => (
          <Collapsible key={index} className="mt-7">
            <CollapsibleTrigger className="p-2 bg-secondary rounded-lg m-2 flex justify-between text-left gap-10 w-full">
              {item.question}
              <ChevronsUpDown className="h-5 w-5"></ChevronsUpDown>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-2">
                <h2 className="text-red-500 p-2 border rounded-lg"><strong>Rating : </strong>{item.rating}</h2>
                <h2 className=" p-2 border rounded-lg bg-red-50 text-sm text-red-900"><strong>Your Answer : </strong>{item.userAns}</h2>
                <h2 className=" p-2 border rounded-lg bg-green-50 text-sm text-green-900"><strong>Correct Answer : </strong>{item.correctAns}</h2>
                <h2 className=" p-2 border rounded-lg bg-blue-50 text-sm text-blue-900"><strong>Feedback : </strong>{item.feedback}</h2>
              </div>
            </CollapsibleContent>
            
          </Collapsible>
        ))}
        </> }
        <Button className="mt-3" onClick={()=>route.replace('/dashboard')}>Go home</Button>
    </div>
  );
}

export default Feedback;
