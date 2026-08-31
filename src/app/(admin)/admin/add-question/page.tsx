import { UniversalQuestionCreator } from "@/components/admin/universal-question-creator";
import {
  getFullQbHierarchy,
  getRecentUploadedQuestions,
} from "@/lib/actions/universal-qb";

export const dynamic = "force-dynamic";

export default async function AdminAddQuestionPage() {
  const [hierarchy, recentQuestions] = await Promise.all([
    getFullQbHierarchy(),
    getRecentUploadedQuestions(10),
  ]);

  return (
    <UniversalQuestionCreator
      hierarchy={hierarchy}
      initialRecentQuestions={recentQuestions}
    />
  );
}
