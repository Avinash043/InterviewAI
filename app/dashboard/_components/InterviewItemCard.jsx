import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button';
import React from 'react'

function InterviewItemCard({interview}) {
    const route = useRouter();
    const onStart=()=>{
        route.push('/dashboard/interview/'+interview?.mockId+'/start')
    }
    const onFeedback=()=>{
        route.push('/dashboard/interview/'+interview?.mockId+'/feedback')
    }
  return (
    <div className='border shadow-sm rounded-lg p-3'>
        <h2 className='font-bold text-primary my-1'>Job Role : {interview?.jobPosition}</h2>
        <h2 className='text-sm text-gray-600 my-1'>Job Experience : {interview?.jobExperience}</h2>
        <h2 className='text-sm text-gray-400 my-1'>Created At : {interview.createdAt}</h2>
        <div className='flex justify-between mt-2 gap-5'>
            
            <Button onClick={onFeedback} size='sm' variant='outline' className='w-full'>Feedback</Button>
            <Button onClick={onStart} size='sm' className='w-full'>Start</Button>
        </div>
    </div>
  )
}

export default InterviewItemCard
