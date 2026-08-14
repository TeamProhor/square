import { type NextRequest, NextResponse } from "next/server";

export default async function proxy(_request: NextRequest) {
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
