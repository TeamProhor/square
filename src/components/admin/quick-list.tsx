"use client";

import Link from "next/link";
import * as React from "react";
import { ArrowRight2 } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface QuickListItem {
	readonly title: React.ReactNode;
	readonly description?: React.ReactNode;
	readonly href?: string;
	readonly onClick?: () => void;
	readonly icon?: React.ElementType | React.ReactNode;
	readonly bg?: string;
	readonly text?: string;
	readonly iconBg?: string;
	readonly extra?: React.ReactNode;
	readonly rightElement?: React.ReactNode;
	readonly className?: string;
	readonly hideCaret?: boolean;
}

interface QuickListProps {
	readonly title?: string;
	readonly titleIcon?: React.ElementType;
	readonly description?: string;
	readonly items: QuickListItem[];
	readonly className?: string;
	readonly gridClassName?: string;
	readonly cardClassName?: string;
	readonly variant?: "grid" | "list";
	readonly gap?: "sm" | "md" | "lg";
	readonly isLoading?: boolean;
	readonly skeletonCount?: number;
	readonly animate?: boolean;
	readonly columns?: {
		readonly sm?: 1 | 2 | 3 | 4;
		readonly md?: 1 | 2 | 3 | 4;
		readonly lg?: 1 | 2 | 3 | 4;
		readonly xl?: 1 | 2 | 3 | 4;
	};
}

const gapMap = {
	sm: "gap-2 md:gap-3",
	md: "gap-3 md:gap-5",
	lg: "gap-4 md:gap-8",
} as const;

const gridCols: Record<string, Record<number, string>> = {
	sm: {
		1: "sm:grid-cols-1",
		2: "sm:grid-cols-2",
		3: "sm:grid-cols-3",
		4: "sm:grid-cols-4",
	},
	md: {
		1: "md:grid-cols-1",
		2: "md:grid-cols-2",
		3: "md:grid-cols-3",
		4: "md:grid-cols-4",
	},
	lg: {
		1: "lg:grid-cols-1",
		2: "lg:grid-cols-2",
		3: "lg:grid-cols-3",
		4: "lg:grid-cols-4",
	},
	xl: {
		1: "xl:grid-cols-1",
		2: "xl:grid-cols-2",
		3: "xl:grid-cols-3",
		4: "xl:grid-cols-4",
	},
};

export function QuickList({
	title,
	titleIcon: TitleIcon,
	description,
	items,
	className,
	gridClassName,
	cardClassName,
	variant = "grid",
	gap = "md",
	isLoading = false,
	skeletonCount = 3,
	animate = true,
	columns,
}: QuickListProps) {
	const getGridCols = () => {
		if (columns) {
			return cn(
				"grid-cols-1",
				columns.sm && gridCols.sm[columns.sm],
				columns.md && gridCols.md[columns.md],
				columns.lg && gridCols.lg[columns.lg],
				columns.xl && gridCols.xl[columns.xl],
			);
		}
		if (variant === "list") return "grid-cols-1";
		return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
	};

	return (
		<div className={cn("flex flex-col gap-4 md:gap-6", className)}>
			{(title || TitleIcon) && (
				<div className="flex flex-col gap-1 px-1">
					<h3 className="flex items-center gap-2 font-heading text-lg md:text-xl font-bold">
						{TitleIcon && <TitleIcon className="size-5 text-primary" />}
						{title}
					</h3>
					{description && (
						<p className="text-sm text-muted-foreground">{description}</p>
					)}
				</div>
			)}

			<div className={cn("grid", getGridCols(), gapMap[gap], gridClassName)}>
				{isLoading
					? Array.from({ length: skeletonCount }, (_, i) => `ql-sk-${i}`).map(
							(id) => (
								<div
									key={id}
									className={cn(
										"rounded-xl bg-muted animate-pulse",
										variant === "grid" ? "h-32 md:h-40" : "h-16 md:h-20",
									)}
								/>
							),
						)
					: items.map((item, idx) => {
							const Icon = item.icon;

							const isIconComponent =
								typeof Icon === "function" ||
								React.isValidElement(Icon) ||
								(typeof Icon === "object" &&
									Icon !== null &&
									!Array.isArray(Icon) &&
									"$$typeof" in Icon);

							const iconBox =
								Icon && isIconComponent ? (
									<div
										className={cn(
											"flex items-center justify-center size-10 md:size-12 rounded-lg md:rounded-xl transition-all duration-300 shrink-0 mr-4 bg-muted",
											item.iconBg,
										)}
									>
										{React.isValidElement(Icon)
											? Icon
											: React.createElement(Icon as React.ElementType, {
													className: cn("size-5 md:size-6", item.text),
												})}
									</div>
								) : (
									Icon
								);

							const body = (
								<>
									<div className="flex flex-col items-start flex-1 min-w-0">
										<div className="flex items-center justify-between w-full gap-2">
											<div
												className={cn(
													"font-bold text-sm md:text-base text-foreground group-hover:text-primary transition-colors leading-tight",
													typeof item.title === "string" && "truncate",
												)}
											>
												{item.title}
											</div>
											{item.extra && (
												<div className="shrink-0">{item.extra}</div>
											)}
										</div>
										{item.description && (
											<div className="text-muted-foreground text-xs md:text-sm font-medium leading-tight mt-1 line-clamp-2">
												{item.description}
											</div>
										)}
									</div>

									{!item.rightElement && item.href && !item.hideCaret && (
										<div className="ml-auto shrink-0 pl-3">
											<ArrowRight2 className="size-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
										</div>
									)}
								</>
							);

							const baseClassName = cn(
								"relative flex items-center p-3 md:p-4 rounded-xl md:rounded-2xl",
								"bg-card border-2 border-border/50 shadow-sm transition-all duration-300 w-full",
								"group overflow-hidden h-full",
								"hover:border-primary/30",
								cardClassName,
								item.className,
							);

							const itemKey =
								item.href ||
								(typeof item.title === "string"
									? item.title
									: `ql-item-${idx}`);

							return (
								<div
									key={itemKey}
									className={cn(
										animate &&
											"animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both",
									)}
								>
									{item.href ? (
										<div className={baseClassName}>
											{item.bg && (
												<div
													className={cn(
														"absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none",
														item.bg,
													)}
												/>
											)}
											<Link
												href={item.href}
												className="absolute inset-0 rounded-xl md:rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
												aria-label={
													typeof item.title === "string"
														? item.title
														: "Quick link"
												}
											/>
											{iconBox}
											{body}
											{item.rightElement && (
												<div className="relative z-10 ml-auto shrink-0 pl-3">
													{item.rightElement}
												</div>
											)}
										</div>
									) : (
										<button
											type="button"
											onClick={item.onClick}
											className={cn(baseClassName, "text-left")}
										>
											{item.bg && (
												<div
													className={cn(
														"absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none",
														item.bg,
													)}
												/>
											)}
											{iconBox}
											{body}
											{item.rightElement && (
												<div className="relative z-10 ml-auto shrink-0 pl-3">
													{item.rightElement}
												</div>
											)}
										</button>
									)}
								</div>
							);
						})}
			</div>
		</div>
	);
}
