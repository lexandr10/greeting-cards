import type { Metadata } from "next";
import React from "react";

import { NO_INDEX_PAGE } from "@/constants/seo.constants";
import CreateCardRoleForm from "./CreateCardRoleForm";


export const metadata: Metadata = {
  title: "Create Card",
  ...NO_INDEX_PAGE,
};

export default function CreateCardPage() {

	return <div>
		<CreateCardRoleForm/>
	</div>
}