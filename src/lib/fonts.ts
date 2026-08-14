import localFont from "next/font/local";

export const hindSiliguri = localFont({
	src: [
		{
			path: "../app/fonts/HindSiliguri-Light.ttf",
			weight: "300",
			style: "normal",
		},
		{
			path: "../app/fonts/HindSiliguri-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../app/fonts/HindSiliguri-Medium.ttf",
			weight: "500",
			style: "normal",
		},
		{
			path: "../app/fonts/HindSiliguri-SemiBold.ttf",
			weight: "600",
			style: "normal",
		},
		{
			path: "../app/fonts/HindSiliguri-Bold.ttf",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-hind-siliguri",
});
