import type { ReactElement } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { dictionary } from "@/lib/dictionary";

export default async function LoginPage(): Promise<ReactElement> {
	const dict = dictionary;

	return <LoginForm dict={dict} />;
}
