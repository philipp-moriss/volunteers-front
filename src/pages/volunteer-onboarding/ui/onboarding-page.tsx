import { FC, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '@/shared/ui';
import backgroundImage from './assets/wheel.webp';
import thankYouImage from './assets/thankYou.webp';
import { ProgressSteps } from './progress-steps';
import { Container } from  '@/shared/ui/container'
import {ProgrammPage} from "@/pages/volunteer-onboarding/ui/programm-page.tsx";

type OnboardingStep = 'program' | 'skills' | 'city' | 'profile' | 'contact' | 'photo' | 'thank-you';

interface OnboardingData {
    programId: string | null;
    skills: string[];
    cityId: string | null;
    hasCar: boolean;
    displayByLocation: boolean;
    maxDistance: number;
    agreementAccepted: boolean;
    firstName: string;
    lastName: string;
    phone: string;
    about: string;
    photo: string | null;
}

export const OnboardingPage: FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentStep, setCurrentStep] = useState<OnboardingStep>('program');
    const [data, setData] = useState<OnboardingData>({
        programId: null,
        skills: [], // Теперь храним ID навыков
        cityId: null,
        hasCar: false,
        displayByLocation: true,
        maxDistance: 3,
        agreementAccepted: false,
        firstName: '',
        lastName: '',
        phone: '',
        about: '',
        photo: null,
    });

    const steps: OnboardingStep[] = ['program', 'skills', 'city', 'profile', 'contact', 'photo', 'thank-you'];
    const currentStepIndex = steps.indexOf(currentStep);

    const skills = [
        { id: 'technology', name: 'Technology', icon: '💻', color: 'bg-blue-100' },
        { id: 'meals', name: 'Meals', icon: '🍲', color: 'bg-green-100' },
        { id: 'medical', name: 'Medical experience', icon: '👨‍⚕️', color: 'bg-orange-100' },
        { id: 'transportation', name: 'Transportation', icon: '🚗', color: 'bg-red-100' },
        { id: 'maintenance', name: 'Maintenance', icon: '🔧', color: 'bg-purple-100' },
        { id: 'electricity', name: 'Electricity', icon: '💡', color: 'bg-yellow-100' },
    ];


    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStep(steps[currentStepIndex + 1]);
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStep(steps[currentStepIndex - 1]);
        }
    };

    const handleSubmit = () => {
        // После финального экрана благодарности переходим на рейтинг
        navigate('/volunteer/leaderboard');
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setData((prev) => ({ ...prev, photo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 'program':
                return true; // Приветственный экран - всегда можно продолжить
            case 'skills':
                return data.skills.length > 0;
            case 'city':
                return true; // Настройки - всегда можно продолжить
            case 'profile':
                return data.agreementAccepted;
            case 'contact':
                return data.firstName.trim() !== '' && data.cityId !== null;
            case 'photo':
                return true; // Фото опционально
            case 'thank-you':
                return true; // Финальный экран
            default:
                return false;
        }
    };


    const renderStepContent = () => {
        switch (currentStep) {
            case 'program':
                return (
                  <ProgrammPage/>
                );

            case 'skills':
                return (
                    <>
                        <div className="flex flex-col gap-3 mb-4">
                            {skills.map((skill) => {
                                const isSelected = data.skills.includes(skill.id);
                                return (
                                    <Card
                                        key={skill.id}
                                        className={`cursor-pointer transition-all relative ${isSelected
                                            ? 'ring-2 ring-primary border-2 border-primary'
                                            : 'border border-gray-200'
                                            }`}
                                        onClick={() => {
                                            setData((prev) => ({
                                                ...prev,
                                                skills: prev.skills.includes(skill.id)
                                                    ? prev.skills.filter((s) => s !== skill.id)
                                                    : [...prev.skills, skill.id],
                                            }));
                                        }}
                                    >
                                        <div className="p-4 flex items-center gap-4">
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                    <svg
                                                        className="w-4 h-4 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className={`w-12 h-12 ${skill.color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                                                {skill.icon}
                                            </div>
                                            <h3 className="font-semibold text-base text-gray-900">
                                                {skill.name}
                                            </h3>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                        <div className="flex items-center gap-2 text-primary cursor-pointer mb-6">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-xl">+</span>
                            </div>
                            <span className="font-medium">{t('onboarding.add')}</span>
                        </div>
                    </>
                );

            case 'city':
                return (
                    <>
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-primary mb-4">
                                {t('onboarding.preferences')}
                            </h2>
                            <div className="space-y-3">
                                {/* I have a car */}
                                <Card className="border border-gray-200">
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-xl">
                                                🚗
                                            </div>
                                            <span className="font-medium text-gray-900">
                                                {t('onboarding.iHaveCar')}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => setData((prev) => ({ ...prev, hasCar: !prev.hasCar }))}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${data.hasCar ? 'bg-primary' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${data.hasCar ? 'translate-x-6' : 'translate-x-0'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </Card>

                                {/* Display by location */}
                                <Card className="border border-gray-200">
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-xl">
                                                📍
                                            </div>
                                            <span className="font-medium text-gray-900">
                                                {t('onboarding.displayByLocation')}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => setData((prev) => ({ ...prev, displayByLocation: !prev.displayByLocation }))}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${data.displayByLocation ? 'bg-primary' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${data.displayByLocation ? 'translate-x-6' : 'translate-x-0'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </Card>

                                {/* Maximum distance */}
                                <Card className="border border-gray-200">
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">
                                                🛣️
                                            </div>
                                            <span className="font-medium text-gray-900">
                                                {t('onboarding.maximumDistance')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setData((prev) => ({ ...prev, maxDistance: Math.max(1, prev.maxDistance - 1) }))}
                                                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                                            >
                                                −
                                            </button>
                                            <span className="font-semibold text-gray-900 min-w-[3rem] text-center">
                                                {data.maxDistance} km
                                            </span>
                                            <button
                                                onClick={() => setData((prev) => ({ ...prev, maxDistance: prev.maxDistance + 1 }))}
                                                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </>
                );

            case 'profile':
                return (
                    <>
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-primary mb-4">
                                {t('onboarding.agreementTitle')}
                            </h2>
                            <div className="text-gray-900 text-base leading-relaxed mb-6 space-y-3">
                                <p>{t('onboarding.agreementWelcome')}</p>
                                <p>{t('onboarding.agreementConfidentiality')}</p>
                                <p>{t('onboarding.agreementCommitment')}</p>
                            </div>
                            <div className="mb-6">
                                <p className="text-gray-700 text-sm mb-4">
                                    {t('onboarding.agreementPrompt')}
                                </p>
                                <div
                                    className="flex items-start gap-3 cursor-pointer"
                                    onClick={() => setData((prev) => ({ ...prev, agreementAccepted: !prev.agreementAccepted }))}
                                >
                                    <div
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${data.agreementAccepted
                                            ? 'bg-primary border-primary'
                                            : 'border-gray-300'
                                            }`}
                                    >
                                        {data.agreementAccepted && (
                                            <svg
                                                className="w-3 h-3 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                    <p className="text-gray-900 text-sm leading-relaxed">
                                        {t('onboarding.agreementConfirm')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                );

            case 'contact':
                return (
                    <>
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-primary mb-2">
                                {t('onboarding.contactDetails')}
                            </h2>
                            <p className="text-gray-600 text-sm mb-6">
                                {t('onboarding.contactDetailsDescription')}
                            </p>
                            <div className="space-y-4">
                                <Input
                                    label={t('onboarding.name')}
                                    placeholder={t('onboarding.namePlaceholder')}
                                    value={data.firstName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setData((prev) => ({ ...prev, firstName: e.target.value }))
                                    }
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('onboarding.city')}
                                    </label>
                                    <select
                                        value={data.cityId || ''}
                                        onChange={(e) =>
                                            setData((prev) => ({ ...prev, cityId: e.target.value || null }))
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">{t('onboarding.cityPlaceholder')}</option>
                                        <option value="1">Tel Aviv</option>
                                        <option value="2">Jerusalem</option>
                                        <option value="3">Haifa</option>
                                        <option value="4">Beer Sheva</option>
                                    </select>
                                </div>
                                {/* <div> */}
                                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('onboarding.phone')}
                                    </label> */}
                                    {/* <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 px-3 py-3 border border-gray-300 rounded-l-2xl bg-gray-50">
                                            <span className="text-lg">🇮🇱</span>
                                            <span className="text-sm text-gray-600">+972</span>
                                        </div>
                                        <Input
                                            type="tel"
                                            placeholder={t('onboarding.phonePlaceholder')}
                                            value={data.phone}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setData((prev) => ({ ...prev, phone: e.target.value }))
                                            }
                                            className="flex-1 rounded-l-none"
                                        />
                                    </div> */}
                                {/* </div> */}
                                <div className="flex items-start gap-3 pt-2">
                                    <input
                                        type="checkbox"
                                        id="privacy"
                                        className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="privacy" className="text-sm text-gray-700">
                                        {t('onboarding.privacyConfirm')}{' '}
                                        <span className="text-primary underline">
                                            {t('onboarding.privacyPolicy')}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </>
                );

            case 'photo':
                return (
                    <>
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-primary mb-2">
                                {t('onboarding.addPicture')}
                            </h2>
                            <p className="text-gray-600 text-base mb-8">
                                {t('onboarding.addPictureDescription')}
                            </p>
                            <div className="flex justify-center">
                                <div
                                    className="cursor-pointer relative"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {data.photo ? (
                                        <img
                                            src={data.photo}
                                            alt="Profile"
                                            className="w-48 h-48 rounded-full object-cover border-4 border-primary-50 shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-[252px] h-[252px] rounded-full bg-primary-50 flex items-center justify-center border-4 border-primary-50 shadow-lg">
                                            <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M34 5.66666C26.5766 5.66666 20.5416 11.7017 20.5416 19.125C20.5416 26.4067 26.2366 32.3 33.66 32.555C33.8866 32.5267 34.1133 32.5267 34.2833 32.555C34.34 32.555 34.3683 32.555 34.425 32.555C34.4533 32.555 34.4533 32.555 34.4816 32.555C41.735 32.3 47.43 26.4067 47.4583 19.125C47.4583 11.7017 41.4233 5.66666 34 5.66666Z" fill="#004573" />
                                                <path d="M48.3933 40.0917C40.4883 34.8217 27.5967 34.8217 19.635 40.0917C16.0367 42.5 14.0533 45.7583 14.0533 49.2433C14.0533 52.7283 16.0367 55.9583 19.6067 58.3383C23.5733 61.0017 28.7867 62.3333 34 62.3333C39.2133 62.3333 44.4267 61.0017 48.3933 58.3383C51.9633 55.93 53.9467 52.7 53.9467 49.1867C53.9183 45.7017 51.9633 42.4717 48.3933 40.0917Z" fill="#004573" />
                                            </svg>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handlePhotoSelect}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                );

            case 'thank-you':
                return (
                    <>
                        <div className="text-center mb-6">
                            <div className="mb-6">
                                <img
                                    src={thankYouImage}
                                    alt="Thank you illustration"
                                    className="w-full h-auto object-contain mx-auto"
                                />
                            </div>
                            <h2 className="text-3xl font-bold text-primary mb-4">
                                {t('onboarding.thankYou')}
                            </h2>
                            <p className="text-gray-700 text-base leading-relaxed px-4">
                                {t('onboarding.thankYouDescription')}
                            </p>
                        </div>
                    </>
                );

            default:
                return null;
        }
    };


    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className={`flex-1 px-4 ${currentStep === 'program' ? 'pb-24 pt-8' : 'pb-24 pt-8'}`}>
                <div className="max-w-md mx-auto">
                    {/* Progress Steps - показываем на всех шагах кроме program */}
                    {currentStep !== 'program' && (
                        <>
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-primary mb-2">
                                    Eshkol Volunteers
                                </h1>
                            </div>
                            <ProgressSteps currentStepIndex={currentStepIndex} totalSteps={steps.length} />
                        </>
                    )}

                    {/* Step Content */}
                    {renderStepContent()}
                </div>
            </div>

            {/* Navigation Buttons - всегда внизу */}
            <div className="fixed bottom-0 left-0 right-0 px-5 pt-5 pb-11 bg-white border-t border-gray-200 z-20">
                <div className="max-w-md mx-auto">
                    {currentStep === 'program' ? (
                        <Button
                            fullWidth
                            size="lg"
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className="shadow-lg"
                        >
                            {t('onboarding.iAmWheelButton')}
                        </Button>
                    ) : (
                        <div className="flex gap-3">
                            {currentStepIndex > 0 && (
                                <Button variant="outline" fullWidth onClick={handleBack}>
                                    {t('common.back')}
                                </Button>
                            )}
                            {currentStep === 'thank-you' ? (
                                <Button
                                    fullWidth
                                    size="lg"
                                    onClick={handleSubmit}
                                    disabled={!canProceed()}
                                >
                                    {t('common.next')}
                                </Button>
                            ) : (
                                <Button
                                    fullWidth
                                    size="lg"
                                    onClick={handleNext}
                                    disabled={!canProceed()}
                                >
                                    {t('common.next')}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
