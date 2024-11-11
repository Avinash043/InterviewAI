import React from "react";
import { Lightbulb, Volume2} from "lucide-react";

function Questions({ interviewQuestions, activeQuestionIndex }) {
  const textToSpeech=(text)=>{
    if('speechSynthesis' in window){
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech)
    }else{
      alert('Sorry, Your browser does not support text to speech')
    }
  }
  return (
    interviewQuestions && (
      <div className="p-5 border rounded-lg my-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {interviewQuestions &&
            interviewQuestions.map((question, index) => (
              <h2
                key={index}
                className={`p-2 bg-secondary rounded-full text0xs md:text-sm text-center cursor-pointer ${
                  activeQuestionIndex == index && "bg-slate-800 text-white"
                }`}
              >
                Question #{index + 1}
              </h2>
            ))}
        </div>
        <h2 className="my-5 text-sm md:text-lg">
          {interviewQuestions[activeQuestionIndex]?.question}
        </h2>
        <Volume2 className="cursor-pointer" onClick={()=>textToSpeech(interviewQuestions[activeQuestionIndex]?.question)}/>
        <div className="border bg-purple-400 rounded-lg p-5 bg-black-100 mt-20">
          <h2 className="flex gap-2 items-center text-purple-950">
            <Lightbulb />
            <strong>Note : </strong>
          </h2>
          <h2 className="text-sm xx text-purple-800 my-2 font-bold">{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
        </div>
      </div>
    )
  );
}

export default Questions;
