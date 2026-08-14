"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getUserAction,
	loginWithPasswordAction,
	logoutAction,
	signUpWithPasswordAction,
} from "@/lib/actions/auth";

export function useUser() {
	return useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			return await getUserAction();
		},
	});
}

export function usePasswordLogin() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (formData: FormData) => {
			const result = await loginWithPasswordAction(formData);
			if (result?.error) throw new Error(result.error);
			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});
}

export function usePasswordSignUp() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (formData: FormData) => {
			const result = await signUpWithPasswordAction(formData);
			if (result?.error) throw new Error(result.error);
			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});
}

export function useLogout() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			await logoutAction();
		},
		onSuccess: () => {
			queryClient.setQueryData(["user"], null);
			queryClient.invalidateQueries();
		},
	});
}
