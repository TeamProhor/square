import Image from "next/image";
import { cn } from "@/lib/utils";

interface MadeWithFooterProps {
	madeWithText: string;
	andText: string;
	className?: string;
}

export function MadeWithFooter({
	madeWithText,
	andText,
	className,
}: MadeWithFooterProps) {
	return (
		<div className={cn("flex flex-row items-center", className)}>
			<h3 className="text-muted-foreground whitespace-nowrap text-[16px] font-[400] font-sans">
				{madeWithText}
			</h3>
			<Image
				src="/icons/heart.svg"
				alt="heart"
				width={24}
				height={24}
				className="shrink-0"
			/>
			<h3 className="text-muted-foreground whitespace-nowrap text-[16px] font-[400] font-sans">
				{andText}
			</h3>
			<Image
				src="/icons/coffee.svg"
				alt="coffee"
				width={24}
				height={24}
				className="shrink-0"
			/>
			<h3 className="text-muted-foreground whitespace-nowrap text-[16px] font-[400] font-sans">
				—
			</h3>
			<h4 className="text-muted-foreground whitespace-nowrap text-[14px] font-[400] font-sans">
				মাহাদী
			</h4>
		</div>
	);
}
