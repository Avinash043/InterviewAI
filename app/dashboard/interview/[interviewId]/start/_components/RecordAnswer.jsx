"use client";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { db } from "@/utils/db.config";
import {UserAnswer} from "@/utils/schema";
import Image from "next/image";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import useSpeechToText from "react-hook-speech-to-text";
import { toast } from "sonner";
import { chatSession } from "@/utils/AIGemeni";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";

function RecordAnswer({
  interviewQuestions,
  activeQuestionIndex,
  interviewData,
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.map((result) => {
      setUserAnswer((preAns) => preAns + result?.transcript);
    });
  }, [results]);

  useEffect(()=>{
    if(!isRecording && userAnswer.length>10){
        UpdateUserAnswer()
    }
  },[userAnswer])

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
      if (userAnswer?.length < 4) {
        setLoading(false);
        toast(
          "Error while saving your answer, Please record your answer again"
        );
        return;
      }
    } else {
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () =>{
    console.log(userAnswer)
    setLoading(true)
    const feedbackPrompt =
        "Question:" +
        interviewQuestions[activeQuestionIndex]?.question +
        ",User Answer: " +
        userAnswer +
        ",Depends on question and user answer for given interview question " +
        "please give us rating for answer and feedback as area of improvement if any" +
        "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

      const result = await chatSession.sendMessage(feedbackPrompt);

      const mockJsonResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");
      
     
      const JsonFeedbackResp = JSON.parse(mockJsonResp);


      console.log(JsonFeedbackResp)

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: interviewQuestions[activeQuestionIndex]?.question,
        correctAns: interviewQuestions[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-yyyy"),
      });

      if (resp) {
        toast("User Answer recorded successfully");
        setResults([]);
      }
      setResults([]);
      setLoading(false);
  }

  return (
    <div className="flex justify-center items-center flex-col">
      <div className="flex flex-col my-20 justify-center items-center bg-black rounded-lg">
        <Image
          priority
          className="absolute"
          src={"/webcam.png"}
          width={200}
          height={200}
          alt="camera"
        ></Image>
        <Webcam
          mirrored={true}
          style={{
            width: "100%",
            height: 300,
            zIndex: 10,
          }}
        />
      </div>

      <Button disabled={loading} variant="outline" className="my-10" onClick={StartStopRecording}>
        {isRecording ? (
          <h2 className="text-red-500 flex gap-2">
            <Mic />
            Stop Recording
          </h2>
        ) : (
          "Record Answer"
        )}
      </Button>
      
    </div>
  );
}

export default RecordAnswer;
