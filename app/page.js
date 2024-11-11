import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
   <div className="grid grid-cols-1 md:grid-cols-2 gap-10 h-svh my-30 sm:mx-5 md:mx-10">
     
      <div className="flex flex-col justify-center ml-12">
      <h1 className="text-2xl mb-12 font-bold font-mono">Welcome to InterviewAI</h1>
        <h1 className="text-6xl font-bold mb-2 font-sans">Master Every Interview with AI-Powered Precision.</h1>
        <h4 className="text-xl mb-2 font-serif">Prepare for success with AI-powered mock interviews, real-time feedback, and personalized insights to build confidence and ace every interview.</h4>
        <Link href={'/dashboard'}>
        <Button className="mt-2 font-bold">Explore</Button>
        </Link>
      </div>
      <div className="m-10 flex justify-center items-center">
        <Image src={'/st.png' } className="rounded-2xl" alt="img" width={500} height={500}/>
      </div>
  </div>
  );
}
