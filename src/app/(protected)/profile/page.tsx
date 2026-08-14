import type { ReactElement } from "react";
import { ProfileMenu } from "@/components/profile/ProfileMenu";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";

export default function ProfilePage(): ReactElement {
	return (
		<div className="w-full bg-background pb-12 lg:pb-0">
			<div className="max-w-7xl mx-auto w-full">
				<div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
					<div className="w-full">
						<div className="w-full flex flex-col lg:flex-row gap-5 md:gap-6 lg:gap-8">
							<ProfileSidebar />
							<ProfileMenu />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
