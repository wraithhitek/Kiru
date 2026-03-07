import { createBrowserRouter } from "react-router";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import AskAITutor from "./pages/AskAITutor";
import ExplainCode from "./pages/ExplainCode";
import DebugError from "./pages/DebugError";
import SimplifyDocs from "./pages/SimplifyDocs";
import ProjectGenerator from "./pages/ProjectGenerator";
import QuizMaster from "./pages/QuizMaster";
import LearningPath from "./pages/LearningPath";
import CodeSnippets from "./pages/CodeSnippets";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Dashboard,
  },
  {
    path: "/signin",
    Component: SignIn,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/dashboard",
    Component: UserDashboard,
  },
  {
    path: "/ask-ai-tutor",
    Component: AskAITutor,
  },
  {
    path: "/explain-code",
    Component: ExplainCode,
  },
  {
    path: "/debug-error",
    Component: DebugError,
  },
  {
    path: "/simplify-docs",
    Component: SimplifyDocs,
  },
  {
    path: "/project-generator",
    Component: ProjectGenerator,
  },
  {
    path: "/quiz-master",
    Component: QuizMaster,
  },
  {
    path: "/learning-path",
    Component: LearningPath,
  },
  {
    path: "/code-snippets",
    Component: CodeSnippets,
  },
]);
