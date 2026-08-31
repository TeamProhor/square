import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { ChapterQuestionsViewer } from "@/components/qb/ChapterQuestionsViewer";
import { db } from "@/db";
import { containers, items, questions, subitems, topics } from "@/db/schema";
import { checkQbContainerAccess } from "@/lib/actions/qb-access";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function QbChapterPage({
  params,
}: {
  readonly params: Promise<{
    containerSlug: string;
    itemSlug: string;
    subitemSlug: string;
  }>;
}): Promise<ReactElement> {
  const { containerSlug, itemSlug, subitemSlug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  const accessInfo = await checkQbContainerAccess(containerSlug, userId);
  if (!accessInfo.exists || !accessInfo.container) {
    notFound();
  }

  const qb = accessInfo.container;

  const subject = await db.query.items.findFirst({
    where: eq(items.slug, itemSlug),
  });

  const chapter = await db.query.subitems.findFirst({
    where: eq(subitems.slug, subitemSlug),
  });

  if (!subject || !chapter) notFound();

  const topicList = await db.query.topics.findMany({
    where: eq(topics.subitemId, chapter.id),
    orderBy: (topics, { asc }) => [asc(topics.name)],
  });

  const questionList = await db.query.questions.findMany({
    where: eq(questions.subitemId, chapter.id),
    with: {
      mcqOptions: true,
      cqParts: true,
    },
    orderBy: (questions, { desc }) => [desc(questions.createdAt)],
  });

  const formattedQuestions = questionList.map((q) => ({
    ...q,
    subitem_id: q.subitemId,
    topic_id: q.topicId || undefined,
    question_text: q.questionText,
    explanation: q.explanation || undefined,
    is_free: q.isFree,
    isFree: q.isFree,
    mcq_options: q.mcqOptions.map((opt) => ({
      ...opt,
      question_id: opt.questionId,
      option_text: opt.optionText,
      is_correct: opt.isCorrect,
      order_no: opt.orderNo,
    })),
    cq_parts: q.cqParts.map((pt) => ({
      ...pt,
      question_id: pt.questionId,
      part_key: pt.partKey,
      question_text: pt.questionText,
      answer_text: pt.answerText || undefined,
      marks: pt.marks,
      order_no: pt.orderNo,
    })),
  }));

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-12 pt-2 md:py-8">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground mb-2 flex-wrap">
          <Link href="/qb" className="hover:text-primary transition-colors">
            প্রশ্নব্যাংক
          </Link>
          <span>/</span>
          <Link
            href={`/qb/${qb.slug}`}
            className="hover:text-primary transition-colors"
          >
            {qb.title}
          </Link>
          <span>/</span>
          <Link
            href={`/qb/${qb.slug}/${subject.slug}`}
            className="hover:text-primary transition-colors"
          >
            {subject.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{chapter.name}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-foreground">
              {chapter.name} - প্রশ্নসমূহ
            </h1>
            <p className="text-muted-foreground text-sm md:text-base mt-1">
              টপিক অনুযায়ী ফিল্টার করে প্রশ্নগুলো অনুশীলন করুন
            </p>
          </div>

          {!accessInfo.hasAccess && (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-600 px-3.5 py-1.5 rounded-xl text-xs font-bold w-fit">
              <span>🔒 উন্মুক্ত ও ফ্রি প্রশ্ন ছাড়া বাকি প্রশ্নের জন্য ব্যাচ এনরোলমেন্ট প্রয়োজন</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <ChapterQuestionsViewer
          topics={topicList || []}
          questions={formattedQuestions || []}
          hasFullAccess={accessInfo.hasAccess}
          assignedBatches={accessInfo.assignedBatches}
        />
      </div>
    </div>
  );
}
