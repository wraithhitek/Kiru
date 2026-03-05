import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AccessibilityButton } from "./components/AccessibilityButton";
import { GlobalTTS } from "./components/GlobalTTS";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <AccessibilityButton />
      <GlobalTTS />
    </>
  );
}
