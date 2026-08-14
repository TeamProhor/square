import type { ReactElement, ReactNode } from "react";
import Shell from "@/components/shell";
import { dictionary } from "@/lib/dictionary";

export default async function AdminLayout({
	children,
}: {
	readonly children: ReactNode;
}): Promise<ReactElement> {
	const dict = dictionary;
	const lang = "en";

	return (
		<Shell dict={dict} lang={lang}>
			{children}
		</Shell>
	);
}
