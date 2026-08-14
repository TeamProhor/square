"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUserProfileAction,
  updateUserProfileAction,
} from "@/lib/actions/user";

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const res = await getUserProfileAction(userId);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    enabled: Boolean(userId),
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: {
      userId: string;
      data: {
        fullName?: string;
        hscBatch?: string;
        college?: string;
        avatarUrl?: string;
      };
    }) => updateUserProfileAction(vars.userId, vars.data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", vars.userId],
      });
    },
  });
}
