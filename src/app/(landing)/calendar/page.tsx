"use client";

import { useState } from "react";
import {
	CalendarTick as CalendarIcon,
	Clock,
	Download,
	Filter,
	Search,
	Star,
	Warning,
} from "@/components/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { EXAMS } from "@/lib/routine";

const handlePrint = () => {
	if (typeof window !== "undefined") {
		window.print();
	}
};

export default function CalendarPage() {
	const [searchTerm, setSearchTerm] = useState("");

	const examDates = EXAMS.map((exam) => exam.dateObj);

	const filteredExams = EXAMS.filter((exam) =>
		exam.subject.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className="flex flex-col min-h-screen pb-20 max-w-5xl mx-auto w-full gap-8">
			<div className="text-center">
				<h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
					এইচএসসি ২০২৬ রুটিন ও দিনপঞ্জি
				</h1>
				<p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto">
					পরীক্ষার রুটিন দেখে নিন সহজে। সার্চ করে যেকোনো বিষয়ের পরীক্ষার সূচী বের করুন
					দ্রুত গতিতে।
				</p>
			</div>

			{/* Live Countdown Card */}
			<Card className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-none shadow-2xl relative overflow-hidden">
				<div className="absolute -top-10 -right-10 opacity-10">
					<Clock
						className="size-64 animate-spin"
						style={{ animationDuration: "60s" }}
					/>
				</div>
				<CardContent className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-5 gap-6 items-center relative z-10">
					<div className="lg:col-span-2 flex flex-col gap-2 text-center lg:text-left items-center lg:items-start">
						<Badge
							variant="outline"
							className="bg-background/20 text-primary-foreground border-background/30 gap-1 uppercase"
						>
							<span className="size-1.5 rounded-full bg-red-500 animate-ping" />{" "}
							কাউন্টডাউন
						</Badge>
						<h2 className="text-lg md:text-xl font-bold leading-tight">
							বোর্ড পরীক্ষা শুরু হতে বাকি:
						</h2>
						<p className="text-xs text-primary-foreground/80">
							প্রথম পরীক্ষা: বাংলা ১ম পত্র (২১ জুন, ২০২৬ ইং)
						</p>
					</div>
					{/* Timer Display Grid */}
					<div className="lg:col-span-3 flex justify-center lg:justify-end">
						<div className="grid grid-cols-4 gap-3 w-full max-w-sm">
							<div className="flex flex-col items-center bg-background/20 rounded-xl p-3">
								<span className="text-2xl md:text-3xl font-bold">120</span>
								<span className="text-[10px] uppercase font-medium mt-1">
									দিন
								</span>
							</div>
							<div className="flex flex-col items-center bg-background/20 rounded-xl p-3">
								<span className="text-2xl md:text-3xl font-bold">14</span>
								<span className="text-[10px] uppercase font-medium mt-1">
									ঘণ্টা
								</span>
							</div>
							<div className="flex flex-col items-center bg-background/20 rounded-xl p-3">
								<span className="text-2xl md:text-3xl font-bold">45</span>
								<span className="text-[10px] uppercase font-medium mt-1">
									মিনিট
								</span>
							</div>
							<div className="flex flex-col items-center bg-background/20 rounded-xl p-3">
								<span className="text-2xl md:text-3xl font-bold">12</span>
								<span className="text-[10px] uppercase font-medium mt-1">
									সেকেন্ড
								</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<div
				className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
				id="print-area"
			>
				{/* Left Sidebar: Calendar & Notices (Sticky on Desktop) */}
				<div className="lg:col-span-1 flex flex-col gap-6 lg:sticky lg:top-8">
					{/* Calendar View */}
					<div className="bg-card border rounded-2xl shadow-sm flex flex-col items-center p-6">
						<div className="text-center pb-4">
							<h3 className="text-sm font-bold flex items-center justify-center gap-2 text-primary">
								<CalendarIcon className="size-4" /> পরীক্ষার দিনপঞ্জি
							</h3>
							<p className="text-xs text-muted-foreground mt-0.5">
								আপনার পরীক্ষার তারিখগুলো
							</p>
						</div>
						<Calendar
							mode="multiple"
							selected={examDates}
							defaultMonth={new Date(2026, 5)}
							className="p-0 border-none bg-transparent shadow-none"
							classNames={{
								day: "pointer-events-none",
							}}
						/>
					</div>

					{/* Quick Tips & Notices */}
					<div className="flex flex-col gap-4">
						<Alert
							variant="destructive"
							className="bg-destructive/5 border-destructive/20 shadow-sm"
						>
							<Warning className="size-4" />
							<AlertTitle className="font-bold">জরুরী নোটিশ</AlertTitle>
							<AlertDescription className="text-xs mt-1.5 leading-relaxed opacity-90">
								পরীক্ষার কমপক্ষে ৩০ মিনিট পূর্বে অবশ্যই হলে প্রবেশ করতে হবে। এডমিট কার্ড,
								রেজিস্ট্রেশন কার্ড ও ক্যালকুলেটর আগের রাতেই ব্যাগে গুছিয়ে রাখুন।
							</AlertDescription>
						</Alert>

						<Alert className="bg-primary/5 border-primary/20 text-primary shadow-sm">
							<Star className="size-4" />
							<AlertTitle className="font-bold">স্মার্ট রিভিশন টিপস</AlertTitle>
							<AlertDescription className="text-xs mt-1.5 leading-relaxed opacity-90">
								পরীক্ষার আগের গ্যাপগুলোতে অযথা নতুন টপিক পড়তে যাবেন না। পূর্বে সমাধান করা
								গাণিতিক নোটস এবং প্র্যাকটিস শিট রিভিশন দিন দ্রুত রিফ্লেক্স পেতে।
							</AlertDescription>
						</Alert>
					</div>
				</div>

				{/* Right Column: Routine Filter Table */}
				<Card className="lg:col-span-2 flex flex-col shadow-sm border-muted-foreground/10">
					<CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b bg-muted/20">
						<div>
							<CardTitle className="flex items-center gap-2 text-lg">
								<Filter className="size-5 text-primary" /> এইচএসসি ২০২৬ চূড়ান্ত
								রুটিন
							</CardTitle>
							<CardDescription className="mt-1">
								সবগুলো পরীক্ষা একই সূচীতে দেখে নিন সহজে
							</CardDescription>
						</div>
						{/* Interactive Search Box */}
						<div className="relative w-full sm:w-64">
							<Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
							<Input
								type="text"
								placeholder="বিষয়ের নাম বা পত্র লিখুন..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-9 bg-background shadow-sm"
							/>
						</div>
					</CardHeader>

					<CardContent className="p-0 flex-1">
						<Table>
							<TableHeader className="bg-muted/40">
								<TableRow>
									<TableHead className="font-bold p-3 sm:p-4 px-3 sm:px-6 text-xs sm:text-sm text-foreground">
										বিষয়ের নাম ও পত্র
									</TableHead>
									<TableHead className="font-bold p-3 sm:p-4 px-3 sm:px-6 text-xs sm:text-sm text-foreground">
										পরীক্ষার তারিখ
									</TableHead>
									<TableHead className="text-right font-bold p-3 sm:p-4 px-3 sm:px-6 text-xs sm:text-sm text-foreground">
										কাউন্টডাউন
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredExams.map((exam) => (
									<TableRow key={exam.id} className="hover:bg-muted/20">
										<TableCell className="font-semibold p-3 sm:p-4 px-3 sm:px-6 text-xs sm:text-sm text-foreground">
											{exam.subject}
										</TableCell>
										<TableCell className="text-muted-foreground p-3 sm:p-4 px-3 sm:px-6 text-xs sm:text-sm">
											{exam.date}
										</TableCell>
										<TableCell className="text-right font-mono text-muted-foreground p-3 sm:p-4 px-3 sm:px-6 text-xs sm:text-sm">
											{exam.countdown}
										</TableCell>
									</TableRow>
								))}
								{filteredExams.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={3}
											className="text-center p-8 text-muted-foreground text-sm"
										>
											কোনো পরীক্ষা পাওয়া যায়নি।
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</CardContent>

					<div className="p-4 bg-muted/20 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
						<div className="flex items-center gap-2">
							<span className="text-xs text-muted-foreground font-medium">
								সর্বমোট পরীক্ষা সংখ্যা:
							</span>
							<Badge
								variant="outline"
								className="font-bold bg-background shadow-sm"
							>
								{EXAMS.length} টি
							</Badge>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={handlePrint}
							className="bg-background shadow-sm hover:bg-muted"
						>
							<Download className="size-3.5 mr-1.5" /> রুটিন প্রিন্ট করুন
						</Button>
					</div>
				</Card>
			</div>
		</div>
	);
}
