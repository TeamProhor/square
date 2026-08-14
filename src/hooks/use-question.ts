"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createContainerAction,
  createItemAction,
  deleteItemAction,
  createSubitemAction,
  deleteSubitemAction,
  createTopicAction,
  deleteTopicAction,
} from "@/lib/actions/question";

export function useQuestionMutations(qbSlug?: string) {
  const queryClient = useQueryClient();

  const createContainer = useMutation({
    mutationFn: (vars: { title: string; slug: string; description?: string }) =>
      createContainerAction(vars.title, vars.slug, vars.description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["containers"] });
    },
  });

  const createItem = useMutation({
    mutationFn: (vars: {
      containerId: string;
      name: string;
      slug: string;
      code: string;
      qbSlug: string;
    }) =>
      createItemAction(
        vars.containerId,
        vars.name,
        vars.slug,
        vars.code,
        vars.qbSlug,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items", qbSlug] });
    },
  });

  const deleteItem = useMutation({
    mutationFn: (vars: { itemId: string; qbSlug: string }) =>
      deleteItemAction(vars.itemId, vars.qbSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items", qbSlug] });
    },
  });

  const createSubitem = useMutation({
    mutationFn: (vars: {
      itemId: string;
      qbSlug: string;
      itemSlug: string;
      name: string;
      slug: string;
      paper?: string;
    }) =>
      createSubitemAction(
        vars.itemId,
        vars.qbSlug,
        vars.itemSlug,
        vars.name,
        vars.slug,
        vars.paper,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subitems"] });
    },
  });

  const deleteSubitem = useMutation({
    mutationFn: (vars: {
      subitemId: string;
      qbSlug: string;
      itemSlug: string;
    }) => deleteSubitemAction(vars.subitemId, vars.qbSlug, vars.itemSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subitems"] });
    },
  });

  const createTopic = useMutation({
    mutationFn: (vars: {
      subitemId: string;
      qbSlug: string;
      itemSlug: string;
      subitemSlug: string;
      name: string;
      slug: string;
    }) =>
      createTopicAction(
        vars.subitemId,
        vars.qbSlug,
        vars.itemSlug,
        vars.subitemSlug,
        vars.name,
        vars.slug,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });

  const deleteTopic = useMutation({
    mutationFn: (vars: {
      topicId: string;
      qbSlug: string;
      itemSlug: string;
      subitemSlug: string;
    }) =>
      deleteTopicAction(
        vars.topicId,
        vars.qbSlug,
        vars.itemSlug,
        vars.subitemSlug,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });

  return {
    createContainer,
    createItem,
    deleteItem,
    createSubitem,
    deleteSubitem,
    createTopic,
    deleteTopic,
  };
}
