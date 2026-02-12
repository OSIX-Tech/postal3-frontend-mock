import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "@/components/RootLayout";
import { AuthLayout } from "@/components/layout";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { DesignSystemPage } from "@/pages/DesignSystemPage";
import { TestListPage } from "@/pages/TestListPage";
import { TestPerformPage } from "@/pages/TestPerformPage";
import { TestResultsPage } from "@/pages/TestResultsPage";
import { MyProfilePage } from "@/pages/MyProfilePage";
import { ProfileSettingsPage } from "@/pages/ProfileSettingsPage";
import { UserProfilePage } from "@/pages/UserProfilePage";
import { StreakDetailPage } from "@/pages/StreakDetailPage";
import { AlertsPage } from "@/pages/AlertsPage";
import { NotificationSettingsPage } from "@/pages/NotificationSettingsPage";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "design-system",
        element: <DesignSystemPage />,
      },
      {
        path: "tests",
        element: <TestListPage />,
      },
      {
        path: "tests/:id",
        element: <TestPerformPage />,
      },
      {
        path: "tests/:id/results",
        element: <TestResultsPage />,
      },
      {
        path: "myspace",
        children: [
          {
            index: true,
            element: <Navigate to="account" replace />,
          },
          {
            path: "account",
            element: <MyProfilePage />,
          },
          {
            path: "options",
            element: <ProfileSettingsPage />,
          },
          {
            path: "streaks",
            element: <StreakDetailPage />,
          },
          {
            path: "alerts",
            element: <AlertsPage />,
          },
          {
            path: "notifications",
            element: <NotificationSettingsPage />,
          },
        ],
      },
      {
        path: "profile/:id",
        element: <UserProfilePage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
