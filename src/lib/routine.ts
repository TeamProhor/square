import type { Exam } from "@/types";

export const EXAMS: readonly Exam[] = [
  {
    id: "bangla-1st",
    subject: "বাংলা ১ম পত্র",
    date: "২১ জুন, ২০২৬",
    dateObj: new Date(2026, 5, 21),
    countdown: "120d 14h",
  },
  {
    id: "bangla-2nd",
    subject: "বাংলা ২য় পত্র",
    date: "২৩ জুন, ২০২৬",
    dateObj: new Date(2026, 5, 23),
    countdown: "122d 10h",
  },
  {
    id: "english-1st",
    subject: "ইংরেজি ১ম পত্র",
    date: "২৫ জুন, ২০২৬",
    dateObj: new Date(2026, 5, 25),
    countdown: "124d 10h",
  },
  {
    id: "english-2nd",
    subject: "ইংরেজি ২য় পত্র",
    date: "২৭ জুন, ২০২৬",
    dateObj: new Date(2026, 5, 27),
    countdown: "126d 10h",
  },
  {
    id: "ict",
    subject: "তথ্য ও যোগাযোগ প্রযুক্তি",
    date: "৩০ জুন, ২০২৬",
    dateObj: new Date(2026, 5, 30),
    countdown: "129d 10h",
  },
  {
    id: "physics-1st",
    subject: "পদার্থবিজ্ঞান ১ম পত্র",
    date: "০২ জুলাই, ২০২৬",
    dateObj: new Date(2026, 6, 2),
    countdown: "131d 10h",
  },
];
