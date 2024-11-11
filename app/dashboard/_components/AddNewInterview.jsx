"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { chatSession } from "@/utils/AIGemeni";
import { LoaderCircleIcon } from "lucide-react";
import { db } from "@/utils/db.config";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { InterviewAI } from "@/utils/schema";
import { useRouter } from "next/navigation";

export default function AddNewInterview() {
  const router = useRouter();
  const { user } = useUser();
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobPosition, jobDesc, jobExperience);

    const InputPrompt = `Job Role:${jobPosition}, Job Description : ${jobDesc}, Years of Experience : ${jobExperience}
Depend on the above information , Please give me 5 question with answers in JSON format.
Give questions and answer in JSON format`;

    const result = await chatSession.sendMessage(InputPrompt);
    const MockResponse = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    setJsonResponse(MockResponse);

    if (MockResponse) {
      const resp = await db
        .insert(InterviewAI)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockResponse,
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .returning({ mockId: InterviewAI.mockId });
      console.log("Inserted Db", resp);
      if (resp) {
        setOpenDialog(false);
        router.push("/dashboard/interview/" + resp[0]?.mockId);
      }
    } else {
      console.log("Error while inserting db");
    }
    setLoading(false);
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your interview
            </DialogTitle>
            <DialogDescription>
              <form action="" onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add about job position, job description and job experience
                  </h2>
                  <div className="mt-5 my-3">
                    <label className="text-black">Job Position/Role</label>
                    <Input
                      className="mt-2"
                      placeholder="Ex. Full Stack Developer"
                      required
                      onChange={(event) => setJobPosition(event.target.value)}
                    ></Input>
                  </div>
                  <div className="my-3">
                    <label className="text-black">Job Description/Tech Stack(In short)</label>
                    <Textarea
                      className="mt-2"
                      placeholder="Ex. React, Angular, MySql, Nodejs etc"
                      required
                      onChange={(event) => setJobDesc(event.target.value)}
                    ></Textarea>
                  </div>
                  <div className="my-3">
                    <label className="text-black">Job Position/Role</label>
                    <Input
                      className="mt-2"
                      placeholder="Ex 5"
                      type="Number"
                      required
                      max="50"
                      onChange={(event) => setJobExperience(event.target.value)}
                    ></Input>
                  </div>
                </div>

                <div className="flex justify-end gap-5">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircleIcon className="animate-spin" />
                        Generating from AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
