export interface MCQQuestion {
  readonly question: string;
  readonly options: readonly string[];
  readonly correctIdx: number;
  readonly explanation: string;
}

export interface MCQChapter {
  readonly name: string;
  readonly board: readonly MCQQuestion[];
  readonly admission: readonly MCQQuestion[];
}

export interface MCQPaper {
  readonly [chapterId: string]: MCQChapter;
}

export interface MCQSubject {
  readonly name: string;
  readonly "1st": MCQPaper;
  readonly "2nd": MCQPaper;
}

export interface MCQDatabase {
  readonly [subjectId: string]: MCQSubject;
}

export const MCQ_DATABASE: MCQDatabase = {
  physics: {
    name: "পদার্থবিজ্ঞান",
    "1st": {
      vector: {
        name: "ভেক্টর",
        board: [
          {
            question:
              "দুটি সমান মানের ভেক্টরের লব্ধির মান তাদের যেকোনো একটির মানের সমান হলে, ভেক্টরদ্বয়ের মধ্যবর্তী কোণ কত?",
            options: [
              "$60^\\circ$",
              "$90^\\circ$",
              "$120^\\circ$",
              "$180^\\circ$",
            ],
            correctIdx: 2,
            explanation:
              "ধরি, $P = Q = R$। আমরা জানি, $R^2 = P^2 + Q^2 + 2PQ \\cos \\alpha$\n$\\implies P^2 = P^2 + P^2 + 2P^2 \\cos \\alpha$\n$\\implies 1 = 2(1 + \\cos \\alpha)$\n$\\implies \\cos \\alpha = -\\frac{1}{2} \\implies \\alpha = 120^\\circ$।",
          },
          {
            question:
              "কোনো স্থানে বায়ুর বেগ $P$, বৃষ্টির বেগ $Q$। ছাতা কোন কোণে ধরতে হবে?",
            options: [
              "$\\theta = \\tan^{-1}(P/Q)$",
              "$\\theta = \\tan^{-1}(Q/P)$",
              "$\\theta = \\cos^{-1}(P/Q)$",
              "$\\theta = \\sin^{-1}(P/Q)$",
            ],
            correctIdx: 0,
            explanation:
              "উল্লম্বের সাথে ছাতা ধরার কোণ, $\\theta = \\tan^{-1}(\\frac{\\text{বায়ুর বেগ}}{\\text{বৃষ্টির বেগ}}) = \\tan^{-1}(\\frac{P}{Q})$।",
          },
          {
            question:
              "একটি ভেক্টর $\\vec{A} = 2\\hat{i} + 2\\hat{j} - \\hat{k}$ এর মান কত?",
            options: ["৩", "৯", "$\\sqrt{5}$", "$\\sqrt{7}$"],
            correctIdx: 0,
            explanation:
              "$|\\vec{A}| = \\sqrt{2^2 + 2^2 + (-1)^2} = \\sqrt{4+4+1} = \\sqrt{9} = 3$।",
          },
          {
            question: "দুটি ভেক্টর পরস্পরের ওপর লম্ব হওয়ার শর্ত কোনটি?",
            options: [
              "$\\vec{A} \\cdot \\vec{B} = 0$",
              "$\\vec{A} \\times \\vec{B} = 0$",
              "$\\vec{A} + \\vec{B} = 0$",
              "$|\\vec{A}| = |\\vec{B}|$",
            ],
            correctIdx: 0,
            explanation:
              "যদি দুটি ভেক্টরের ডট গুণফল শূন্য হয় ($\\vec{A} \\cdot \\vec{B} = 0$), তবে তাদের মধ্যবর্তী কোণ $90^\\circ$ বা তারা পরস্পর লম্ব হয়।",
          },
          {
            question: "নিচের কোনটি স্কেলার রাশি?",
            options: ["বল", "তড়িৎ প্রাবল্য", "কাজ", "বেগ"],
            correctIdx: 2,
            explanation:
              "কাজের কেবল মান রয়েছে কিন্তু কোনো দিক নেই, তাই কাজ একটি স্কেলার রাশি।",
          },
        ],
        admission: [
          {
            question:
              "একটি স্রোতস্বিনী নদীর প্রস্থ $500\\text{ m}$। স্রোতের বেগ $3\\text{ m/s}$ and নৌকার বেগ $6\\text{ m/s}$। সর্বনিম্ন সময়ে নদী পার হতে কোন কোণে রওনা দিতে হবে?",
            options: [
              "$90^\\circ$",
              "$120^\\circ$",
              "$150^\\circ$",
              "$0^\\circ$",
            ],
            correctIdx: 0,
            explanation:
              "সর্বনিম্ন সময়ে নদী পার হওয়ার জন্য নৌকাকে স্রোতের সাথে ঠিক লম্বভাবে বা $90^\\circ$ কোণে রওনা দিতে হয়। এখানে সময় $t = d/v$ যা কোণের ওপর নির্ভর করে না যখন $\\alpha = 90^\\circ$।",
          },
          {
            question: "ভেক্টর ক্ষেত্র $\\vec{F}$ সোলেনয়ডাল (Solenoidal) হবে যদি—",
            options: [
              "$\\nabla \\cdot \\vec{F} = 0$",
              "$\\nabla \\times \\vec{F} = 0$",
              "$\\nabla^2 \\vec{F} = 0$",
              "$\\nabla \\cdot \\vec{F} = 1$",
            ],
            correctIdx: 0,
            explanation:
              "যদি কোনো ভেক্টর ক্ষেত্রের ডাইভারজেন্স শূন্য হয় ($\\nabla \\cdot \\vec{F} = 0$), তবে তাকে সোলেনয়ডাল বলা হয়।",
          },
          {
            question:
              "$\\vec{P} = \\hat{i} + \\hat{j} + \\hat{k}$ ভেক্টরটি $x$-অক্ষের সাথে কত কোণ তৈরি করে?",
            options: [
              "$45^\\circ$",
              "$\\cos^{-1}(1/\\sqrt{3})$",
              "$\\cos^{-1}(1/3)$",
              "$90^\\circ$",
            ],
            correctIdx: 1,
            explanation:
              "কোসাইন দিক কোণ সূত্রানুসারে, $\\cos \\theta_x = \\frac{P_x}{|P|} = \\frac{1}{\\sqrt{1^2+1^2+1^2}} = \\frac{1}{\\sqrt{3}}$। অতএব, $\\theta_x = \\cos^{-1}(1/\\sqrt{3})$।",
          },
        ],
      },
      dynamics: {
        name: "গতিবিদ্যা",
        board: [
          {
            question:
              "স্থির অবস্থান থেকে সুষম ত্বরণে চলমান কোনো বস্তুর অতিক্রান্ত দূরত্ব সময়ের—",
            options: [
              "সমানুপাতিক",
              "বর্গের সমানুপাতিক",
              "ব্যস্তানুপাতিক",
              "বর্গের ব্যস্তানুপাতিক",
            ],
            correctIdx: 1,
            explanation:
              "গতির সমীকরণ $s = ut + \\frac{1}{2}at^2$ থেকে পাই, স্থির অবস্থানে $u = 0$ এবং সুষম ত্বরণে $a$ ধ্রুবক। তাই $s \\propto t^2$ (সময়ের বর্গের সমানুপাতিক)।",
          },
          {
            question: "প্রাসের গতিপথ কেমন হয়?",
            options: ["বৃত্তাকার", "পরাবৃত্তাকার (Parabolic)", "উপবৃত্তাকার", "সরলরৈখিক"],
            correctIdx: 1,
            explanation:
              "প্রাসের গতির সমীকরণ একটি দ্বিঘাত সমীকরণ প্রকাশ করে, তাই এর গতিপথ পরাবৃত্তাকার বা প্যারাবোলিক।",
          },
        ],
        admission: [
          {
            question:
              "একটি প্রাসকে $30^\\circ$ কোণে $40\\text{ m/s}$ বেগে নিক্ষেপ করা হলো। এর সর্বোচ্চ উচ্চতা কত?",
            options: [
              "$20.4\\text{ m}$",
              "$40.8\\text{ m}$",
              "$10.2\\text{ m}$",
              "$80\\text{ m}$",
            ],
            correctIdx: 0,
            explanation:
              "সর্বোচ্চ উচ্চতা $H = \\frac{v_0^2 \\sin^2 \\theta}{2g} = \\frac{40^2 \\cdot \\sin^2 30^\\circ}{2 \\cdot 9.8} = \\frac{1600 \\cdot 0.25}{19.6} \\approx 20.4\\text{ m}$।",
          },
        ],
      },
      newtonian: {
        name: "নিউটনিয়ান বলবিদ্যা",
        board: [
          {
            question: "বলের ঘাত নিচের কোনটির পরিবর্তনের সমান?",
            options: ["গতিশক্তি", "বিভবশক্তি", "ভরবেগ", "ত্বরণ"],
            correctIdx: 2,
            explanation:
              "বলের ঘাত ($J = F \\Delta t$) ভরবেগের পরিবর্তনের ($\\Delta p$) সমান।",
          },
        ],
        admission: [
          {
            question:
              "একটি চাকার কৌণিক সরণ $\\theta = 2t^3 - 5t^2$। $t=2\\text{ s}$ সময়ে চাকাটির কৌণিক ত্বরণ কত?",
            options: [
              "$14\\text{ rad/s}^2$",
              "$24\\text{ rad/s}^2$",
              "$12\\text{ rad/s}^2$",
              "$10\\text{ rad/s}^2$",
            ],
            correctIdx: 0,
            explanation:
              "কৌণিক বেগ, $\\omega = \\frac{d\\theta}{dt} = 6t^2 - 10t$। কৌণিক ত্বরণ, $\\alpha = \\frac{d\\omega}{dt} = 12t - 10$। $t = 2\\text{ s}$ বসিয়ে পাই, $\\alpha = 12(2) - 10 = 14\\text{ rad/s}^2$।",
          },
        ],
      },
    },
    "2nd": {
      thermo: {
        name: "তাপগতিবিদ্যা",
        board: [
          {
            question: "তাপগতিবিদ্যার ১ম সূত্র কোন বিষয়ের ওপর ভিত্তি করে প্রতিষ্ঠিত?",
            options: [
              "ভরের সংরক্ষণশীলতা",
              "শক্তির সংরক্ষণশীলতা",
              "এনট্রপি",
              "তাপমাত্রা পরিমাপ",
            ],
            correctIdx: 1,
            explanation:
              "তাপগতিবিদ্যার প্রথম সূত্র মূলত শক্তির নিত্যতা বা সংরক্ষণশীলতা নীতির রূপান্তর মাত্র।",
          },
        ],
        admission: [],
      },
      current: {
        name: "চল তড়িৎ",
        board: [
          {
            question: "হুইটস্টোন ব্রিজের সাম্যাবস্থার শর্ত কোনটি?",
            options: ["$P/Q = R/S$", "$PQ = RS$", "$P+Q = R+S$", "$P-Q = R-S$"],
            correctIdx: 0,
            explanation:
              "হুইটস্টোন ব্রিজের গ্যালভানোমিটারের মধ্য দিয়ে তড়িৎ প্রবাহ শূন্য হওয়ার শর্ত হলো চারটি রোদের অনুপাত সমান হওয়া, অর্থাৎ $P/Q = R/S$।",
          },
        ],
        admission: [],
      },
    },
  },
  chemistry: {
    name: "রসায়ন",
    "1st": {
      qualitative: {
        name: "গুণগত রসায়ন",
        board: [
          {
            question: "কোন অরবিটালটি অসম্ভব?",
            options: ["$1s$", "$2p$", "$2d$", "$3f$"],
            correctIdx: 2,
            explanation:
              "$n=2$ এর জন্য $l=0, 1$ সম্ভব। অর্থাৎ শুধু $2s$ এবং $2p$ অরবিটাল সম্ভব। $2d$ অরবিটালের অস্তিত্ব অসম্ভব।",
          },
          {
            question: "ক্রোমিয়ামের ($Cr - 24$) সঠিক ইলেকট্রন বিন্যাস কোনটি?",
            options: [
              "$[Ar] 3d^4 4s^2$",
              "$[Ar] 3d^5 4s^1$",
              "$[Ar] 3d^6 4s^0$",
              "$[Ar] 3d^3 4s^2$",
            ],
            correctIdx: 1,
            explanation:
              "অর্ধপূর্ণ $d$ অরবিটালের স্থায়িত্ব বেশি হওয়ার কারণে ক্রোমিয়ামের ইলেকট্রন বিন্যাস সাধারণ নিয়মের ব্যতিক্রম হয়ে $[Ar] 3d^5 4s^1$ হয়।",
          },
        ],
        admission: [
          {
            question:
              "ক্যালসিয়াম ফসফেটের [$Ca_3(PO_4)_2$] দ্রাব্যতা গুণফল ($K_{sp}$) এর সমীকরণ কোনটি? (যদি দ্রাব্যতা $S$ হয়)",
            options: ["$4S^3$", "$27S^4$", "$108S^5$", "$256S^6$"],
            correctIdx: 2,
            explanation:
              "$Ca_3(PO_4)_2 \\rightleftharpoons 3Ca^{2+} + 2PO_4^{3-}$।\n$K_{sp} = [Ca^{2+}]^3 [PO_4^{3-}]^2 = (3S)^3 (2S)^2 = 27S^3 \\cdot 4S^2 = 108S^5$।",
          },
        ],
      },
      periodic: {
        name: "পর্যায়বৃত্ত ধর্ম",
        board: [
          {
            question: "নিচের কোনটির তড়িৎ ঋণাত্মকতা সবচেয়ে বেশি?",
            options: ["F", "Cl", "O", "N"],
            correctIdx: 0,
            explanation:
              "পুরো পর্যায় সারণীর মধ্যে ফ্লোরিন (F) এর তড়িৎ ঋণাত্মকতা সবচেয়ে বেশি (মান ৪.০)।",
          },
        ],
        admission: [],
      },
    },
    "2nd": {
      environmental: {
        name: "পরিবেশ রসায়ন",
        board: [
          {
            question: "কোন তাপমাত্রাকে পরম শূন্য তাপমাত্রা বলা হয়?",
            options: [
              "$0^\\circ\\text{C}$",
              "$273\\text{ K}$",
              "$-273.15^\\circ\\text{C}$",
              "$0^\\circ\\text{F}$",
            ],
            correctIdx: 2,
            explanation:
              "$-273.15^\\circ\\text{C}$ বা $0\\text{ K}$ তাপমাত্রাকে পরম শূন্য তাপমাত্রা বলা হয়, যেখানে গ্যাসের আয়তন তাত্ত্বিকভাবে শূন্য হয়ে যায়।",
          },
        ],
        admission: [],
      },
      organic: {
        name: "জৈব রসায়ন",
        board: [
          {
            question: "বেনজিনে পাই ($\\pi$) ইলেকট্রন সংখ্যা কতটি?",
            options: ["৩ টি", "৬ টি", "১২ টি", "২ টি"],
            correctIdx: 1,
            explanation:
              "বেনজিন বলয়ে ৩টি দ্বিবন্ধন রয়েছে। প্রতি দ্বিবন্ধনে ২টি করে মোট ৬টি পাই ($\\pi$) ইলেকট্রন থাকে।",
          },
        ],
        admission: [],
      },
    },
  },
  math: {
    name: "উচ্চতর গণিত",
    "1st": {
      matrix: {
        name: "ম্যাট্রিক্স ও নির্ণায়ক",
        board: [
          {
            question:
              "একটি বর্গ ম্যাট্রিক্স $A$ ব্যতিক্রমী বা সিঙ্গুলার (Singular) হবে যদি—",
            options: ["$|A| > 0$", "$|A| = 0$", "$|A| < 0$", "$A = A^T$"],
            correctIdx: 1,
            explanation:
              "যে বর্গ ম্যাট্রিক্সের নির্ণায়কের মান শূন্য হয় ($|A|=0$), তাকে ব্যতিক্রমী বা সিঙ্গুলার ম্যাট্রিক্স বলে।",
          },
          {
            question:
              "যদি $A$ একটি $3 \\times 3$ ম্যাট্রিক্স হয় এবং $|A| = 5$ হয়, তবে $|2A|$ এর মান কত?",
            options: ["১০", "২০", "৪০", "৮০"],
            correctIdx: 2,
            explanation:
              "আমরা জানি, $|kA| = k^n |A|$ (যেখানে $n$ হলো ম্যাট্রিক্সের ক্রম)। এখানে $n=3$ এবং $k=2$, তাই $|2A| = 2^3 |A| = 8 \\times 5 = 40$।",
          },
        ],
        admission: [],
      },
      straight: {
        name: "সরলরেখা",
        board: [
          {
            question: "$(1, \\sqrt{3})$ বিন্দুর পোলার স্থানাঙ্ক কোনটি?",
            options: [
              "$(2, 30^\\circ)$",
              "$(2, 60^\\circ)$",
              "$(4, 60^\\circ)$",
              "$(2, 45^\\circ)$",
            ],
            correctIdx: 1,
            explanation:
              "$r = \\sqrt{1^2 + (\\sqrt{3})^2} = \\sqrt{4} = 2$\n$\\theta = \\tan^{-1}(\\frac{\\sqrt{3}}{1}) = 60^\\circ$। অতএব পোলার স্থানাঙ্ক $(2, 60^\\circ)$।",
          },
        ],
        admission: [],
      },
    },
    "2nd": {
      complex: {
        name: "জটিল সংখ্যা",
        board: [
          {
            question:
              "এককের কাল্পনিক ঘনমূল $\\omega$ হলে, $1 + \\omega + \\omega^2$ এর মান কত?",
            options: ["১", "$\\omega$", "০", "$-1$"],
            correctIdx: 2,
            explanation:
              "এককের কাল্পনিক ঘনমূল তিনটির সমষ্টি সর্বদা শূন্য হয়, অর্থাৎ $1 + \\omega + \\omega^2 = 0$।",
          },
        ],
        admission: [],
      },
      polynomial: {
        name: "বহুপদী ও বহুপদী সমীকরণ",
        board: [
          {
            question: "$ax^2 + bx + c = 0$ সমীকরণের মূলগুলো সমান হওয়ার শর্ত কী?",
            options: [
              "$b^2 - 4ac = 0$",
              "$b^2 - 4ac > 0$",
              "$b^2 - 4ac < 0$",
              "$b = ac$",
            ],
            correctIdx: 0,
            explanation:
              "দ্বিঘাত সমীকরণের নিশ্চয়ক বা পৃথায়ক ($D = b^2 - 4ac$) এর মান শূন্য হলে সমীকরণের মূলগুলো বাস্তব ও সমান হয়।",
          },
        ],
        admission: [],
      },
    },
  },
};

export const FALLBACK_MCQS: readonly MCQQuestion[] = [
  {
    question: "বিজ্ঞান ও প্রযুক্তির যেকোনো শাখায় সাফল্যের মূল ভিত্তি কী?",
    options: [
      "বেসিক থিওরি স্পষ্ট হওয়া",
      "অন্ধের মতো মুখস্থ করা",
      "সঠিক মেন্টরশিপ না নেওয়া",
      "পরীক্ষায় নকল করা",
    ],
    correctIdx: 0,
    explanation:
      "যেকোনো কঠিন বিষয়ের ওপর দক্ষতা অর্জন করতে হলে প্রথমে তার বেসিক ধারণা বা থিওরিটিক্যাল ভিত্তি পরিষ্কার থাকা অত্যন্ত প্রয়োজনীয়।",
  },
  {
    question: "ইঞ্জিনিয়ারিং ভর্তি পরীক্ষায় ভালো করার জন্য সবচেয়ে কার্যকর অভ্যাস কোনটি?",
    options: [
      "প্রশ্নব্যাংক বারবার সমাধান করা",
      "শুধু কোচিংয়ের ক্লাস করা",
      "হাতে ক্যালকুলেশন প্র্যাকটিস না করা",
      "পরীক্ষার আগের রাতে না ঘুমানো",
    ],
    correctIdx: 0,
    explanation:
      "বিগত বছরের প্রশ্ন ব্যাংক (Question Bank) বিশ্লেষণ ও সমাধান করলে পরীক্ষার ধরন, টাইম ম্যানেজমেন্ট এবং গুরুত্বপূর্ণ টপিক সম্পর্কে ১০০% ধারণা পাওয়া যায়।",
  },
];
