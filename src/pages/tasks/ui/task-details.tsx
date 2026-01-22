import {useParams} from "react-router-dom";
import mission_illustration from "@/shared/assets/images/mission_illustration.webp";
import {Button, Card} from "@/shared/ui";
import {useGetTaskById} from "@/entities/task/hook/useGetTaskId.ts";
import smsIcon from '@/shared/assets/images/sms.webp';
import phoneIcon from '@/shared/assets/images/phone.webp';
import watsappIcon from '@/shared/assets/images/watsapp.webp';
import {t} from "i18next";
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Lottie from "lottie-react"
import successAnimation from "@/shared/assets/animations/confetti.json"


export const TaskDetailsPage = () => {
  const [showAnimation, setShowAnimation] = useState<boolean>(false)
  const navigate = useNavigate();
  const {taskId} = useParams()
  const {data: task, isLoading, isError} = useGetTaskById(taskId)

  if (!taskId) {
    return <div>Invalid task link</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !task) {
    return <div>Task not found</div>
  }

  return (
    <>
      {showAnimation && (
        <div className="fixed inset-0 z-100 flex items-end justify-center">
          <Lottie
            animationData={successAnimation}
            loop={false}
            className="w-full h-1/2"
            onComplete={() => {
              navigate(`/volunteer/tasks/${taskId}/completed`)
            }}
          />
        </div>
      )}
      <section className="flex flex-col min-h-screen pt-24 pb-24 px-5 text-center gap-4">
        <div className={'flex flex-col gap-8'}>
          <img
            src={mission_illustration}
          />
          <div className={'flex flex-col gap-3'}>
            <h1 className="border-none bg-transparent py-0 text-2xl text-primary-900">
              {task?.title}
            </h1>
            <p className="text-textGray font-normal">{taskId}</p>
            <Card variant={'elevated'} className={'p-4 flex flex-col gap-3 items-start text-left w-full'}>
              <p className="text-textGray font-normal">To carry out the task, please contact</p>
              <p className="text-textGray font-medium">{task.needy?.firstName} {task.needy?.lastName}</p>
              <a href="tel:0501234567">
                <p className={'text-deepBlue font-normal flex flex-row items-center gap-2'}>
              <span>
                <img
                  src={phoneIcon}
                  className="w-6 h-6 object-contain shrink-0"
                  alt="icon"
                />
              </span>
                  <span>{task.needy?.phone}</span>
                </p>
              </a>
              <a href={`sms:${task.needy?.phone}`}>
                <p className={'text-deepBlue font-normal flex flex-row items-center gap-2'}>
              <span>
                <img
                  src={smsIcon}
                  className="w-6 h-6 object-contain shrink-0"
                  alt="icon"
                />
              </span>
                  Send a message
                </p>
              </a>
              <a href={`https://wa.me/${task.needy?.phone}`}
                 target="_blank"
                 rel="noopener noreferrer" >
                <p className={'text-deepBlue font-normal flex flex-row items-center gap-2'}>
              <span>
                <img
                  src={watsappIcon}
                  className="w-6 h-6 object-contain shrink-0 rounded-full"
                  alt="icon"
                />
              </span>
                  Send a WhatsApp message
                </p>
              </a>
              <p className="text-textGray font-medium text-left w-80">
                At the end of the task, please let us know
                that it has been completed, so we can feel at ease🙏</p>
            </Card>
          </div>
        </div>
        <div className={' flex flex-col gap-3 mt-auto'}>
          <Button size={'lg'} fullWidth={true} variant={'secondary'} onClick={() => setShowAnimation(true)}>
            The task is complete!
          </Button>
        </div>
      </section>
    </>
  )
}