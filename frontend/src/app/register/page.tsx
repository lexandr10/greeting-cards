import type { Metadata } from "next";

import { NO_INDEX_PAGE } from "@/constants/seo.constants";
import RegisterForm from "./registerForm";


export const metadata: Metadata = {
  title: "Register",
  ...NO_INDEX_PAGE,
};

export default function RegisterPage() {
  return (
    <div>
    <RegisterForm/>
    </div>
  );
}
