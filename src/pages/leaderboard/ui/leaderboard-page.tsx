import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Header } from '@/shared/ui';
import { IconUser } from '@/shared/assets/images/iconUser/iconUser';
import trophy1 from './assets/Gemini_Generated_Image_87xzbo87xzbo87xz 1.png';
import trophy2 from './assets/Gemini_Generated_Image_87xzbo87xzbo87xz 1 (1).png';
import trophy3 from './assets/Gemini_Generated_Image_87xzbo87xzbo87xz 1 (2).png';
import trophyIllustration from './assets/Gemini_Generated_Image_fjh4ihfjh4ihfjh4 1.png';

interface Community {
    id: string;
    name: string;
    volunteers: number;
    points: number;
    rank: number;
}

export const LeaderboardPage: FC = () => {
    const { t } = useTranslation();

    // Мок данные для топ-3
    const topThree: Community[] = [
        { id: '2', name: 'Kerem', volunteers: 374, points: 0, rank: 2 },
        { id: '1', name: 'Nir Oz', volunteers: 390, points: 0, rank: 1 },
        { id: '3', name: 'Nirim', volunteers: 295, points: 0, rank: 3 },
    ];

    // Мок данные для остальных
    const otherCommunities: Community[] = [
        { id: '4', name: 'Kisufim', volunteers: 98, points: 280, rank: 4 },
        { id: '5', name: 'Reim', volunteers: 76, points: 271, rank: 5 },
        { id: '6', name: 'Holit', volunteers: 48, points: 267, rank: 6 },
    ];

    const getTrophyImage = (rank: number) => {
        switch (rank) {
            case 1:
                return trophy1;
            case 2:
                return trophy2;
            case 3:
                return trophy3;
            default:
                return trophy1;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Header
                title={t('leaderboard.title')}
                rightActions={[
                    <IconUser key="settings" />
                ]}
            />
            <div className="px-4 py-8">
                <div className="max-w-md mx-auto">

                    {/* Топ-3 сообщества */}
                    <Card className="mb-4 p-6 rounded-[12px] border border-[#F2F2F2] border-b-4 border-r-4">
                        <div className="flex items-stretch">
                            {/* 2-е место */}
                            <div className="flex flex-col items-center flex-1 relative">
                                <div className="absolute right-0 top-0 bottom-0 w-px bg-[#F2F2F2]"></div>
                                <div className="mb-3">
                                    <img
                                        src={getTrophyImage(2)}
                                        alt="2nd place"
                                        className="w-14 h-14 object-contain"
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-gray-900 text-base mb-1">
                                        {topThree[0].name}
                                    </p>
                                    <p className="text-gray-600 text-sm">{topThree[0].volunteers}</p>
                                </div>
                            </div>

                            {/* 1-е место */}
                            <div className="flex flex-col items-center flex-1 relative">
                                <div className="absolute right-0 top-0 bottom-0 w-px bg-[#F2F2F2]"></div>
                                <div className="mb-3">
                                    <img
                                        src={getTrophyImage(1)}
                                        alt="1st place"
                                        className="w-20 h-20 object-contain"
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-gray-900 text-base mb-1">
                                        {topThree[1].name}
                                    </p>
                                    <p className="text-gray-600 text-sm">{topThree[1].volunteers}</p>
                                </div>
                            </div>

                            {/* 3-е место */}
                            <div className="flex flex-col items-center flex-1">
                                <div className="mb-3">
                                    <img
                                        src={getTrophyImage(3)}
                                        alt="3rd place"
                                        className="w-14 h-14 object-contain"
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-gray-900 text-base mb-1">
                                        {topThree[2].name}
                                    </p>
                                    <p className="text-gray-600 text-sm">{topThree[2].volunteers}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Призыв к действию */}
                    <Card className="mb-4 p-4 bg-blue-50 border-0">
                        <div className="flex flex-col items-center">
                            {/* Иллюстрация сверху */}
                            <div className="mb-4 -mt-8">
                                <img
                                    src={trophyIllustration}
                                    alt="Trophy illustration"
                                    className="w-32 h-32 object-contain"
                                />
                            </div>

                            <h2 className="text-lg font-bold text-primary mb-2 text-center">
                                {t('leaderboard.wantToWin')}
                            </h2>
                            <p className="text-sm text-primary mb-4 text-center">
                                {t('leaderboard.addVolunteersDescription')}
                            </p>
                            <button className="w-full bg-white border border-[#004573] border-b-4 border-r-4 text-primary font-bold py-3 px-6 rounded-[12px]">
                                {t('leaderboard.addVolunteers')}
                            </button>
                        </div>
                    </Card>

                    {/* Остальные сообщества */}
                    <Card className="p-4">
                        <div className="space-y-3">
                            {otherCommunities.map((community) => (
                                <div
                                    key={community.id}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-semibold text-sm">
                                            {community.rank}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 text-sm">
                                            {community.name}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {community.volunteers} {t('leaderboard.volunteers')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-primary">
                                            {community.points} {t('leaderboard.points')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
