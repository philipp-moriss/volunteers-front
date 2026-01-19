import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthPage } from '@/pages/auth/ui';
import { TasksPage } from '@/pages/tasks/ui';
import { UIKitPage } from '@/pages/ui-kit/ui';
import { OnboardingPage } from '@/pages/volunteer-onboarding/ui';
import { LeaderboardPage } from '@/pages/leaderboard/ui';
import { PrivateRoute } from './private-route';
import { RoleRedirect } from './role-redirect';
import { TaskPreviewPage } from '@/pages/tasks/ui';

export const Router: FC = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* Публичные роуты */}
        <Route path="/ui-kit" element={<UIKitPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Онбординг волонтера */}
        <Route
          path="/volunteer/onboarding"
          element={
            <PrivateRoute allowedRoles={['volunteer']}>
              <OnboardingPage />
            </PrivateRoute>
          }
        />

        {/* Редирект на основе роли */}
        <Route path="/" element={<RoleRedirect />} />

        {/* Роуты для волонтеров */}
        <Route
          path="/volunteer"
          element={
            <PrivateRoute allowedRoles={['volunteer']}>
              <TasksPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/volunteer/tasks"
          element={
            <PrivateRoute allowedRoles={['volunteer']}>
              <TasksPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/volunteer/leaderboard"
          element={
            <PrivateRoute allowedRoles={['volunteer']}>
              <LeaderboardPage />
            </PrivateRoute>
          }
        />

        <Route path="/volunteer/tasks/:taskId/preview" element={
          <PrivateRoute allowedRoles={['volunteer']}>
            <TaskPreviewPage />
          </PrivateRoute>
        } />

        {/* Роуты для нуждающихся */}
        <Route
          path="/needy"
          element={
            <PrivateRoute allowedRoles={['needy']}>
              <TasksPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/needy/tasks"
          element={
            <PrivateRoute allowedRoles={['needy']}>
              <TasksPage />
            </PrivateRoute>
          }
        />

        {/* Роуты для админов */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <div>Admin Panel</div>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
