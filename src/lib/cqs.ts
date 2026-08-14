export interface CQPart {
	readonly id: string;
	readonly part_key: string;
	readonly question_text: string;
	readonly answer_text?: string;
	readonly order_no: number;
}

export interface CQQuestion {
	readonly id: string;
	readonly type: "written";
	readonly question_text: string;
	readonly parts: readonly CQPart[];
	readonly explanation?: string;
}

export interface CQChapter {
	readonly name: string;
	readonly board: readonly CQQuestion[];
	readonly admission: readonly CQQuestion[];
}

export interface CQPaper {
	readonly [chapterId: string]: CQChapter;
}

export interface CQSubject {
	readonly name: string;
	readonly "1st": CQPaper;
	readonly "2nd": CQPaper;
}

export interface CQDatabase {
	readonly [subjectId: string]: CQSubject;
}

export const CQ_DATABASE: CQDatabase = {
	physics: {
		name: "পদার্থবিজ্ঞান",
		"1st": {
			vector: {
				name: "ভেক্টর",
				board: [
					{
						id: "cq-phy-1-vec-b1",
						type: "written",
						question_text:
							"কোনো বিন্দুতে ক্রিয়ারত দুটি ভেক্টর রাশি $ \\vec{P} $ ও $ \\vec{Q} $ এর লব্ধি $ \\vec{R} $।",
						parts: [
							{
								id: "cq-phy-1-vec-b1-ka",
								part_key: "ক",
								question_text: "নাল ভেক্টর কী?",
								answer_text: "যে ভেক্টরের মান শূন্য তাকে নাল ভেক্টর বলে।",
								order_no: 1,
							},
							{
								id: "cq-phy-1-vec-b1-kha",
								part_key: "খ",
								question_text:
									"দুটি ভেক্টরের লব্ধির সর্বোচ্চ মান তাদের যোগফলের সমান- ব্যাখ্যা কর।",
								answer_text:
									"আমরা জানি, লব্ধি $ R = \\sqrt{P^2 + Q^2 + 2PQ \\cos \\alpha} $। যখন $ \\alpha = 0^\\circ $ হয়, তখন $ R = P + Q $ হয়, যা লব্ধির সর্বোচ্চ মান।",
								order_no: 2,
							},
							{
								id: "cq-phy-1-vec-b1-ga",
								part_key: "গ",
								question_text:
									"$ P = 5 \\text{ N} $, $ Q = 10 \\text{ N} $ এবং মধ্যবর্তী কোণ $ 60^\\circ $ হলে লব্ধির মান নির্ণয় কর।",
								answer_text:
									"$ R = \\sqrt{5^2 + 10^2 + 2 \\cdot 5 \\cdot 10 \\cos 60^\\circ} = \\sqrt{25 + 100 + 50} = \\sqrt{175} \\approx 13.23 \\text{ N} $।",
								order_no: 3,
							},
							{
								id: "cq-phy-1-vec-b1-gha",
								part_key: "ঘ",
								question_text:
									"লব্ধি $ R $ যদি $ P $ এর সাথে সমকোণ তৈরি করে, তবে $ Q $ এর মান কত হতে হবে? গাণিতিক বিশ্লেষণ কর।",
								answer_text:
									"যদি লব্ধি সমকোণ তৈরি করে তবে $ \\tan 90^\\circ = \\frac{Q \\sin \\alpha}{P + Q \\cos \\alpha} $। যেহেতু $ \\tan 90^\\circ = \\infty $, তাই $ P + Q \\cos \\alpha = 0 $ হতে হবে। এখান থেকে আমরা $ Q $ এর মান বের করতে পারি।",
								order_no: 4,
							},
						],
						explanation: "ভেক্টরের সামান্তরিক সূত্র থেকে এই প্রশ্নের উত্তর দেওয়া হয়েছে।",
					},
				],
				admission: [],
			},
		},
		"2nd": {},
	},
};
