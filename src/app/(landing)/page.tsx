import Link from "next/link";
import { Send } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { dictionary } from "@/lib/dictionary";

export default async function Home() {
	const dict = dictionary;
	const d = dict;

	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-col items-center gap-[24px] w-full">
				<h1 className="max-w-[500px] text-center text-[24px] lg:text-[32px] tracking-[-0.025em] font-[600] text-foreground leading-normal font-sans tracking-tight mt-2">
					{d.home.title}
				</h1>
				<h4 className="max-w-[300px] text-center text-muted-foreground text-[14px] font-sans font-[400]">
					{d.home.subtitle}
				</h4>

				<div className="flex flex-row flex-wrap justify-center gap-[12px] mt-2">
					<Button
						asChild
						variant="outline"
						className="flex flex-row items-center gap-[8px] px-[12px] py-[4px] bg-muted rounded-[12px] border-[0.5px] border-border hover:bg-accent transition-colors shadow-none text-foreground font-sans font-[400] h-auto text-[14px]"
					>
						<Link href={`/submit`}>
							<Send size={24} className="size-6" color="currentColor" />
							{d.sidebar.submit}
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
