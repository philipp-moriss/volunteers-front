import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthPage } from '@/pages/auth/ui';
import { TasksPage } from '@/pages/tasks/ui';
import { UIKitPage } from '@/pages/ui-kit/ui';
import { OnboardingPage } from '@/pages/volunteer-onboarding/ui';
import { LeaderboardPage } from '@/pages/leaderboard/ui';
import { SettingsPage } from '@/pages/settings/ui';
import { PrivateRoute } from './private-route';
import { RoleRedirect } from './role-redirect';
import { TaskPreviewPage } from '@/pages/tasks/ui';
import {TaskDetailsPage} from "@/pages/tasks/ui/task-details.tsx";
import {TaskCompletedPage} from "@/pages/tasks/ui/task-completed.tsx";
import {CategoriesPage} from "@/pages/needy-categories";

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
        <Route
          path="/volunteer/settings"
          element={
            <PrivateRoute allowedRoles={['volunteer']}>
              <SettingsPage />
            </PrivateRoute>
          }
        />

        <Route path="/volunteer/tasks/:taskId/preview" element={
          <PrivateRoute allowedRoles={['volunteer']}>
            <TaskPreviewPage />
          </PrivateRoute>
        } />

        <Route path={"/volunteer/tasks/:taskId"} element={
          <PrivateRoute allowedRoles={['volunteer']}>
            <TaskDetailsPage />
          </PrivateRoute>
        } />

        <Route path={"/volunteer/tasks/:taskId/completed"} element={
          <PrivateRoute allowedRoles={['volunteer']}>
            <TaskCompletedPage />
          </PrivateRoute>
        } />

        {/* Роуты для нуждающихся */}
        <Route
          path="/needy"
          element={
            <PrivateRoute allowedRoles={['needy']}>
              <CategoriesPage />
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
        <Route
          path="/needy/settings"
          element={
            <PrivateRoute allowedRoles={['needy']}>
              <SettingsPage />
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
