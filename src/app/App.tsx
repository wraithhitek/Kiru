import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AccessibilityButton } from "./components/AccessibilityButton";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <AccessibilityButton />
    </>
  );
}
