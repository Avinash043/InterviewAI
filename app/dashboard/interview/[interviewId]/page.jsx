"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { db } from "@/utils/db.config";
import { InterviewAI } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useParams } from 'next/navigation'
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";

function Interview() {
   const params = useParams()
  const [interviewData, setInterviewData] = useState([]);
  const [webCamEnabled, setWebCamEnabled] = useState();
  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(InterviewAI)
      .where(eq(InterviewAI.mockId, params.interviewId));
    setInterviewData(result[0]);
  };
  return (
    <div className="my-10 ">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-3">
          <div className="flex flex-col p-5 rounded-lg border gap-5">
          <h2 className="text-lg">
            <strong>Job Role / Position : </strong>
            {interviewData.jobPosition}
          </h2>
          <h2 className="text-lg">
            <strong>Job Description / Tech Stack : </strong>
            {interviewData.jobDesc}
          </h2>
          <h2 className="text-lg">
            <strong>Years of Experience : </strong>
            {interviewData.jobExperience}
          </h2>
          </div>
          <div className="p-5 border rounded-lg border-yellow-100 bg-yellow-200">
            <h2 className="flex gap-2 items-center text-yellow-800 "><Lightbulb/><strong>Information</strong></h2>
            <h2 className="mt-3 text-yellow-600">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>
        </div>
        <div>
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 600,
              }}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-7 bg-secondary rounded-lg border"></WebcamIcon>
              <Button variant='ghost' className='w-full font-bold' onClick={() => setWebCamEnabled(true)}>
                Enable Camera and Microphone
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end items-center">
        <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
        <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;
