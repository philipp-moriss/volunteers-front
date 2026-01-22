import {Button} from "@/shared/ui";
import crown from '@/shared/assets/images/crown.webp'
import {useNavigate} from "react-router-dom";

export const TaskCompletedPage = () => {

  const navigate = useNavigate();
  const onClickHandler = () => {
    navigate('/volunteer/tasks');
  };


  return (
    <section className="bg-backGround flex flex-col min-h-screen pt-24 pb-12 px-5 text-center">
      <div className={'flex flex-col gap-8'}>
        <img
          src={crown}
        />
        <div className={'flex flex-col gap-3'}>
          <h1 className="border-none bg-transparent py-0 text-2xl text-primary-900">
            You are amazing!
          </h1>
          <p className="text-textGray font-normal">Thank you very much for all the help.</p>
          <p className="text-textGray font-normal">Thanks to you, our world is a better place!</p>
        </div>
      </div>
      <div className={' flex flex-col gap-3 mt-auto'}>
        <Button size={'lg'} fullWidth={true} variant={'secondary'} onClick={onClickHandler}>
          Return to tasks.
        </Button>
      </div>
    </section>
  )
}