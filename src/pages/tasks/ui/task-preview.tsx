import {Button, Card, Header} from "@/shared/ui";
import {t} from "i18next";
import mission_illustration from '@/shared/assets/images/mission_illustration.webp'

export const TaskPreviewPage = () => {

  const onClickHandler = () => {console.log('click!')}

  return (
    <section className="bg-backGround flex flex-col min-h-screen pt-24 pb-12 px-5 text-center">
      <div className={'flex flex-col gap-8'}>
        <img
          src={mission_illustration}
        />
        <div className={'flex flex-col gap-3'}>
          <Header
            title={t('New details have been received for the task you wanted!')}
            className="border-none bg-transparent py-0"
          />
          <Card>
            <p>Come view the task details now
              so you can schedule a time to complete it</p>
          </Card>
        </div>
      </div>
      <div className={' flex flex-col gap-3 mt-auto'}>
        <Button size={'lg'} fullWidth={true} variant={'secondary'} onClick={onClickHandler}>
          View task details
        </Button>
        <Button size={'lg'} fullWidth={true} variant={'outline'} onClick={onClickHandler}>
          Later
        </Button>
      </div>
    </section>
  )
}