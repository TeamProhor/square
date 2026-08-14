"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NewSubjectForm } from "@/components/admin/forms/new-subject-form";
import { QuickList, type QuickListItem } from "@/components/admin/quick-list";
import { ArrowRight2, BookOpen, TaskSquare, Trash2 } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { deleteItemAction as deleteSubjectAction } from "@/lib/actions/question";
import type { Container, Item } from "@/types";

interface AdminItemsManagerProps {
	readonly qb: Container;
	readonly initialSubjects: readonly Item[];
}

export function AdminItemsManager({
	qb,
	initialSubjects,
}: AdminItemsManagerProps) {
	const router = useRouter();
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	const handleDelete = async (e: React.MouseEvent, subjectId: string) => {
		e.preventDefault();
		e.stopPropagation();
		if (confirm("এই বিষয়টি স্থায়ীভাবে ডিলিট করতে চান?")) {
			await deleteSubjectAction(subjectId, qb.slug);
			router.refresh();
		}
	};

	const items: QuickListItem[] = initialSubjects.map((sub: Item) => ({
		href: `/admin/qb/${qb.slug}/${sub.slug}`,
		title: sub.name,
		description: (
			<span className="flex items-center gap-3 text-xs">
				<span className="flex items-center gap-1 font-medium">
					<BookOpen className="size-3.5" /> {sub.subitems?.[0]?.count ?? 0} টি
					অধ্যায়
				</span>
				<span className="flex items-center gap-1 font-medium">
					<TaskSquare className="size-3.5" /> {sub.questions?.[0]?.count ?? 0}{" "}
					টি প্রশ্ন
				</span>
			</span>
		),
		icon: BookOpen,
		text: "text-primary",
		iconBg: "bg-primary/10",
		extra: (
			<Badge variant="outline" className="text-xs font-semibold">
				আইডি: {sub.id}
			</Badge>
		),
		rightElement: (
			<Button
				variant="ghost"
				size="sm"
				onClick={(e) => handleDelete(e, sub.id)}
				className="text-destructive hover:bg-destructive/10 gap-1 rounded-xl text-xs"
			>
				<Trash2 className="size-3.5" />
				<span>ডিলিট</span>
			</Button>
		),
	}));

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
				<Link
					href="/admin/qb"
					className="hover:text-foreground transition-colors"
				>
					প্রশ্নব্যাংকসমূহ
				</Link>
				<ArrowRight2 className="size-3" />
				<span className="text-foreground font-semibold">{qb.title}</span>
			</div>

			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
						{qb.title} - বিষয়সমূহ
					</h1>
					<p className="text-muted-foreground text-sm mt-1">
						বিষয় নির্বাচন করে অধ্যায় দেখুন অথবা নতুন বিষয় যোগ ও রিমুভ করুন।
					</p>
				</div>

				<Button
					onClick={() => setIsCreateOpen(true)}
					className="rounded-xl gap-2 font-bold"
				>
					+ নতুন বিষয় যোগ করুন
				</Button>
			</div>

			<QuickList items={items} columns={{ sm: 1, md: 2, lg: 3 }} gap="md" />

			<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle className="text-base font-bold">
							{qb.title} এ নতুন বিষয়
						</DialogTitle>
						<DialogDescription>বিষয়ের আইডি, নাম ও কোড লিখুন।</DialogDescription>
					</DialogHeader>
					<NewSubjectForm
						qbId={qb.id}
						qbSlug={qb.slug}
						onSuccess={() => {
							setIsCreateOpen(false);
							router.refresh();
						}}
						onCancel={() => setIsCreateOpen(false)}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
