import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

import { Providers } from "./providers";
import { Header } from "@/components/Header";

const zen = Noto_Sans({
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-zen",
  style: ["normal"],
});



export const metadata: Metadata = {
	title: 
	{
		default: 'Greeting Cards',
		template: `%s \ Greeting Cards`
	},
	description: "Thank you for check my App"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${zen.variable}  antialiased`}>
				<Providers>
					<Header/>
          {children}
          <Toaster theme="dark" position="bottom-right" duration={1500} />
        </Providers>
      </body>
    </html>
  );
}
