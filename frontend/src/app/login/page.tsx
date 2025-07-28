import type { Metadata } from "next";

import { NO_INDEX_PAGE } from "@/constants/seo.constants";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
  ...NO_INDEX_PAGE,
};

export default function LoginPage() {
  return (
    <div>
      <LoginForm/>
    </div>
  );
}
