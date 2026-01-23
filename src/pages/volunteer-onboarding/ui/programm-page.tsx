import {Container} from "@/shared/ui/container";
import backgroundImage from "@/pages/volunteer-onboarding/ui/assets/wheel.webp";
import {t} from "i18next";

export const ProgrammPage = () => {
  return (
    <Container>
      {/* Иллюстрация */}
      <div className="mb-8 w-full">
        <img
          src={backgroundImage}
          alt="Onboarding illustration"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Текст */}
      <div className="text-center px-4">
        <h1 className="text-deepBlue text-3xl font-medium mb-4">
            {t('onboarding.selectProgram')}
        </h1>
        <p className="text-textGray text-base leading-relaxed">
          {t('onboarding.selectProgramDescription')}
        </p>
      </div>
    </Container>
  );
}