export interface CourseModule {
  readonly id: string;
  readonly title: string;
  readonly chapters: readonly string[];
  readonly totalClasses: number;
}

export interface Course {
  readonly slug: string;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly hscBatch: "HSC 26" | "HSC 27" | "Admission";
  readonly price: number;
  readonly originalPrice?: number;
  readonly image: string;
  readonly badge?: string;
  readonly features: readonly string[];
  readonly routineInfo: {
    readonly schedule: string;
    readonly platform: string;
    readonly duration: string;
    readonly totalClasses: number;
    readonly totalExams: number;
  };
  readonly modules: readonly CourseModule[];
  readonly faqs: readonly {
    readonly question: string;
    readonly answer: string;
  }[];
  readonly instructors: readonly {
    readonly name: string;
    readonly role: string;
    readonly institution: string;
    readonly image?: string;
  }[];
}

export const COURSES: readonly Course[] = [
  {
    slug: "hsc-26-full-preparation",
    title: "HSC 26 পূর্ণাঙ্গ প্রস্তুতি কোর্স",
    subtitle: "ফিজিক্স, কেমিস্ট্রি, ম্যাথ ও বায়োলজির এ টু জেড পূর্ণাঙ্গ একাডেমিক ও অ্যাডমিশন ফাউন্ডেশন",
    description:
      "এইচএসসি ২০২৬ ব্যাচের শিক্ষার্থীদের জন্য বিশেষভাবে ডিজাইন করা এই কোর্সটিতে থাকছে বেসিক টু প্রো লেভেলের লাইভ ক্লাস, স্ট্যান্ডার্ড এক্সাম, হ্যান্ডনোট এবং সার্বক্ষণিক ডাউট সলভ সুবিধা।",
    hscBatch: "HSC 26",
    badge: "সর্বাধিক জনপ্রিয়",
    price: 6000,
    originalPrice: 8000,
    image:
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200",
    features: [
      "১২০+ লাইভ ইন্টারেক্টিভ ক্লাস",
      "অধ্যায়ভিত্তিক স্ট্যান্ডার্ড CQ ও MCQ পরীক্ষা",
      "লেকচার শিট ও মাস্টার নোটস পিডিএফ",
      "২৪/৭ টেলিগ্রাম ডেডিকেটেড ডাউট সলভ গ্রুপ",
      "বোর্ড ও বিশ্ববিদ্যালয় প্রশ্নব্যাংক সল্যুশন",
    ],
    routineInfo: {
      schedule: "রবি, মঙ্গল, বৃহস্পতি (রাত ৮:০০ - ৯:৩০)",
      platform: "ওয়েব পোর্টাল ও প্রাইভেট লাইভ ক্লাস",
      duration: "৮ মাস",
      totalClasses: 120,
      totalExams: 40,
    },
    modules: [
      {
        id: "physics-1",
        title: "পদার্থবিজ্ঞান ১ম পত্র",
        chapters: [
          "ভেক্টর",
          "নিউটনিয়ান বলবিদ্যা",
          "কাজ, শক্তি ও ক্ষমতা",
          "মহাকর্ষ ও অভিকর্ষ",
          "পদার্থের গাঠনিক ধর্ম",
        ],
        totalClasses: 35,
      },
      {
        id: "chemistry-1",
        title: "রসায়ন ১ম পত্র",
        chapters: [
          "গুণগত রসায়ন",
          "পর্যায়বৃত্ত ধর্ম ও রাসায়নিক বন্ধন",
          "রাসায়নিক পরিবর্তন",
          "কর্মমুখী রসায়ন",
        ],
        totalClasses: 30,
      },
    ],
    faqs: [
      {
        question: "ক্লাসগুলো কীভাবে অনুষ্ঠিত হবে?",
        answer: "ক্লাসগুলো আমাদের নিজস্ব প্ল্যাটফর্মে নির্ধারিত সময়ে লাইভ অনুষ্ঠিত হবে।",
      },
    ],
    instructors: [
      {
        name: "ইঞ্জি. শোয়াইব আহমেদ",
        role: "লিড ইন্সট্রাক্টর",
        institution: "BUET, CSE",
      },
    ],
  },
  {
    slug: "physics-masterclass-hsc-26",
    title: "Physics Masterclass (HSC 26)",
    subtitle: "পদার্থবিজ্ঞান ১ম ও ২য় পত্রের জটিল গাণিতিক সমস্যার নিখুঁত সমাধান ও থিওরি ক্লিয়ারিং",
    description:
      "পদার্থবিজ্ঞানে A+ নিশ্চিত করতে এবং বুয়েট/মেডিকেল/ভার্সিটি ভর্তি পরীক্ষার শক্ত ভিত্তি তৈরিতে সম্পূর্ণ ফিজিক্স সিলেবাসের বিশেষ স্পেশালাইজড মাস্টারকোর্স।",
    hscBatch: "HSC 26",
    badge: "বেস্ট সেলার",
    price: 2000,
    originalPrice: 3000,
    image:
      "https://images.unsplash.com/photo-1636466483764-44a5f033d839?auto=format&fit=crop&q=80&w=1200",
    features: [
      "৬০+ ডেডিকেটেড ফিজিক্স লাইভ ক্লাস",
      "গাণিতিক সমস্যাবলির ১০০০+ স্পেশাল সলভ শিট",
      "চ্যাপ্টারভিত্তিক মেগা এক্সাম ও সলভ ক্লাস",
      "কনসেপ্ট ক্লিয়ারিং অ্যানিমেশন ও প্রাক্টিক্যাল এক্সপ্ল্যানেশন",
    ],
    routineInfo: {
      schedule: "শনি, সোম, বুধ (রাত ৯:৩০ - ১১:০০)",
      platform: "ওয়েব পোর্টাল ও লাইভ ক্লাস",
      duration: "৪ মাস",
      totalClasses: 60,
      totalExams: 25,
    },
    modules: [
      {
        id: "p1-mechanics",
        title: "১ম পত্র: মেকানিক্স ও প্রোপার্টিজ অব ম্যাটার",
        chapters: ["ভেক্টর", "নিউটনিয়ান মেকানিক্স", "কাজ, শক্তি ও ক্ষমতা"],
        totalClasses: 30,
      },
    ],
    faqs: [
      {
        question: "বেসিক দুর্বল হলেও কি কোর্সটি বোঝা সম্ভব?",
        answer: "হ্যাঁ, প্রতিটি অধ্যায় একেবারে শূন্য লেভেল থেকে শুরু করে পড়ানো হবে।",
      },
    ],
    instructors: [
      {
        name: "ইঞ্জি. শোয়াইব আহমেদ",
        role: "ফিজিক্স মেন্টর",
        institution: "BUET, CSE",
      },
    ],
  },
  {
    slug: "higher-math-calculus-algebra",
    title: "উচ্চতর গণিত স্পেশাল প্যাক",
    subtitle: "ক্যালকুলাস, ত্রিকোণমিতি, সরলরেখা ও বৃত্তের টাইপভিত্তিক শর্টকাট ও প্রুফ মাস্টারক্লাস",
    description:
      "এইচএসসি ও অ্যাডমিশনের গণিত ভীতি দূর করে গণিতে শতভাগ নম্বর নিশ্চিত করার জন্য স্পেশাল হ্যান্ডক্রাফটেড প্রবলেম সলভিং কোর্স।",
    hscBatch: "HSC 26",
    badge: "ম্যাথ স্পেশাল",
    price: 2200,
    originalPrice: 3200,
    image:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1200",
    features: [
      "৫০+ ডেডিকেটেড ম্যাথ লাইভ ক্লাস",
      "ক্যালকুলাস ও ত্রিকোণমিতি মাস্টার শিট",
      "ক্যালকুলেটর হ্যাকস ও শর্টকাট ট্রিকস",
      "সাপ্তাহিক স্পিড টেস্ট ও লাইভ কুইজ",
    ],
    routineInfo: {
      schedule: "রবি, মঙ্গল, বৃহস্পতি (সন্ধ্যা ৬:৩০ - ৮:০০)",
      platform: "ওয়েব পোর্টাল ও লাইভ ক্লাস",
      duration: "৪ মাস",
      totalClasses: 50,
      totalExams: 20,
    },
    modules: [
      {
        id: "math-calculus",
        title: "ক্যালকুলাস (অন্তরীকরণ ও যোগজীকরণ)",
        chapters: ["লিমিট ও অবিচ্ছিন্নতা", "অন্তরীকরণ", "যোগজীকরণ ও ক্ষেত্রফল"],
        totalClasses: 25,
      },
    ],
    faqs: [
      {
        question: "ক্যালকুলেটর শর্টকাট শেখানো হবে?",
        answer: "হ্যাঁ, ক্লাসিও ও বিভিন্ন ক্যালকুলেটরের এক্সক্লুসিভ ট্রিকস শেখানো হবে।",
      },
    ],
    instructors: [
      {
        name: "ইঞ্জি. শোয়াইব আহমেদ",
        role: "গণিত মেন্টর",
        institution: "BUET, CSE",
      },
    ],
  },
  {
    slug: "organic-chemistry-mastery",
    title: "জৈব রসায়ন ও কেমিস্ট্রি স্পেশাল",
    subtitle: "জৈব যৌগের রূপান্তর, বিক্রিয়া মেকানিজম ও বিক্রিয়া মনে রাখার নির্ভুল কৌশল",
    description:
      "রসায়ন ১ম ও ২য় পত্রের সবচেয়ে গুরুত্বপূর্ণ অংশ জৈব রসায়ন, রাসায়নিক পরিবর্তন এবং গুণগত রসায়ন সহজবোধ্যভাবে আয়ত্ত করার কোর্স।",
    hscBatch: "HSC 26",
    badge: "কেমিস্ট্রি প্যাক",
    price: 1800,
    originalPrice: 2800,
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1200",
    features: [
      "৪০+ লাইভ ক্লাস ও রিঅ্যাকশন ট্র্যাকার",
      "জৈব রসায়নের ১০০+ স্পেশাল রূপান্তর শিট",
      "অধ্যায়ভিত্তিক বোর্ড স্ট্যান্ডার্ড CQ সলভ",
      "লাইভ ডাউট সলভিং ও রিভিশন এক্সাম",
    ],
    routineInfo: {
      schedule: "শনি, সোম, বুধ (রাত ৭:০০ - ৮:৩০)",
      platform: "ওয়েব পোর্টাল ও লাইভ ক্লাস",
      duration: "৩.৫ মাস",
      totalClasses: 45,
      totalExams: 18,
    },
    modules: [
      {
        id: "chem-organic",
        title: "জৈব রসায়ন ও বিক্রিয়া কৌশল",
        chapters: ["জৈব যৌগের নামকরণ", "সমাণুতা", "অ্যালকেন, অ্যালকিন, অ্যালকাইন", "অ্যারোমেটিক যৌগ"],
        totalClasses: 25,
      },
    ],
    faqs: [
      {
        question: "রিঅ্যাকশন মনে রাখার সহজ পদ্ধতি আছে?",
        answer: "হ্যাঁ, মাইন্ডম্যাপ ও চার্টের মাধ্যমে সহজে মনে রাখার কৌশল শেখানো হবে।",
      },
    ],
    instructors: [
      {
        name: "তানভীর হাসান",
        role: "কেমিস্ট্রি মেন্টর",
        institution: "DU, Chemistry",
      },
    ],
  },
  {
    slug: "hsc-26-mega-exam-batch",
    title: "HSC 26 মেগা এক্সাম ব্যাচ",
    subtitle: "বোর্ড ও প্রি-টেস্ট স্ট্যান্ডার্ড ৩০+ পেপার ফাইনাল, বিষয়ভিত্তিক ও পূর্ণাঙ্গ মডেল টেস্ট",
    description:
      "চূড়ান্ত প্রস্তুতির আসল পরীক্ষা। ওএমআর ও সৃজনশীল খাতা মূল্যায়নসহ নিজের জাতীয় অবস্থান যাচাই করার জন্য সবচেয়ে উপযোগী এক্সাম ব্যাচ।",
    hscBatch: "HSC 26",
    badge: "এক্সাম অনলি",
    price: 1200,
    originalPrice: 2000,
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200",
    features: [
      "৩০+ ফুল লেন্থ বোর্ড স্ট্যান্ডার্ড এক্সাম",
      "তাৎক্ষণিক অটোমেটেড মেরিট লিস্ট ও অ্যানালাইসিস",
      "প্রতিটি পরীক্ষার পূর্ণাঙ্গ সল্যুশন বুক পিডিএফ",
      "ভুল প্রশ্নের ডেডিকেটেড রিটেক ও রিভিশন মোড",
    ],
    routineInfo: {
      schedule: "প্রতি শুক্র ও সোমবার (সকাল ১০:০০ ও রাত ৮:০০)",
      platform: "অনলাইন এক্সাম পোর্টাল",
      duration: "পরীক্ষার পূর্ব পর্যন্ত",
      totalClasses: 10,
      totalExams: 35,
    },
    modules: [
      {
        id: "exam-series",
        title: "কমপ্লিট মডেল টেস্ট সিরিজ",
        chapters: ["অধ্যায়ভিত্তিক পরীক্ষা", "পেপার ফাইনাল", "সাবজেক্ট ফাইনাল", "পূর্ণাঙ্গ বোর্ড মডেল টেস্ট"],
        totalClasses: 10,
      },
    ],
    faqs: [
      {
        question: "পরীক্ষা মিস করলে কি পরে দেওয়া যাবে?",
        answer: "হ্যাঁ, যেকোনো সময় প্র্যাকটিস মোডে পরীক্ষা দিতে পারবে।",
      },
    ],
    instructors: [
      {
        name: "ইঞ্জি. শোয়াইব আহমেদ",
        role: "প্রধান পরিচালক",
        institution: "BUET, CSE",
      },
    ],
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}
