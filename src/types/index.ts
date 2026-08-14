import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from "react";
import type { dictionary } from "@/lib/dictionary";

export type Dictionary = typeof dictionary;

export interface PageProps {
  readonly params: Promise<{ readonly lang: string }>;
}

export interface LayoutProps extends PageProps {
  readonly children: ReactNode;
}

export interface ShellProps {
  readonly children: ReactNode;
  readonly dict: Dictionary;
  readonly lang: string;
}

export interface SidebarProps {
  readonly onClose?: () => void;
  readonly dict: Dictionary;
  readonly lang: string;
}

export interface SubmitFormProps {
  readonly d: Dictionary["submit"];
}

export interface ThemeProviderProps {
  readonly children: ReactNode;
}

export type TransitionVariant =
  | "circle"
  | "square"
  | "triangle"
  | "diamond"
  | "hexagon"
  | "rectangle"
  | "star";

export interface ThemeTogglerProps extends ComponentPropsWithoutRef<"button"> {
  readonly duration?: number;
  readonly variant?: TransitionVariant;
  /** When true, the transition expands from the viewport center instead of the button center. */
  readonly fromCenter?: boolean;
  /**
   * Controlled theme value. When provided, the parent owns persistence
   * (e.g. `next-themes`) and this component will not write to localStorage.
   */
  readonly theme?: "light" | "dark";
  /** Called on toggle. Pair with `theme` for controlled usage. */
  readonly onThemeChange?: (theme: "light" | "dark") => void;
}

export interface LoginFormProps {
  readonly dict: Dictionary;
}

export interface AppBadgeChipProps {
  readonly iconSrc: string;
  readonly iconAlt: string;
  readonly text: string;
  readonly className?: string;
}

export interface DownloadMacButtonProps {
  readonly text: string;
  readonly className?: string;
}

export interface Resource {
  readonly id: string;
  readonly title: string;
  readonly url: string;
  readonly thumbnail: string;
  readonly images: readonly string[];
}

export interface ResourceRowCardProps {
  readonly resource: Resource;
  readonly previewText: string;
  readonly downloadText: string;
}

export interface NavItem {
  readonly name: string;
  readonly path: string;
  readonly exact: boolean;
  readonly icon: ComponentType<{
    readonly size?: number;
    readonly color?: string;
    readonly className?: string;
  }>;
  readonly count?: number;
}

export interface Exam {
  readonly id: string;
  readonly subject: string;
  readonly date: string;
  readonly dateObj: Date;
  readonly countdown: string;
}

export interface SidebarAnnouncement {
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly title: string;
  readonly subtitle: string;
  readonly href: string;
}

export interface Container {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly description?: string;
  readonly items?: { readonly count: number }[];
}

export interface Item {
  readonly id: string;
  readonly container_id: string;
  readonly name: string;
  readonly code: string;
  readonly slug: string;
  readonly subitems?: { readonly count: number }[];
  readonly questions?: { readonly count: number }[];
}

export interface Subitem {
  readonly id: string;
  readonly item_id: string;
  readonly paper?: string;
  readonly name: string;
  readonly slug: string;
  readonly order_no: number;
  readonly topics?: { readonly count: number }[];
  readonly questions?: { readonly count: number }[];
}

export interface Topic {
  readonly id: string;
  readonly subitem_id: string;
  readonly name: string;
  readonly slug: string;
  readonly questions?: { readonly count: number }[];
}

export interface MCQOption {
  readonly id: string;
  readonly question_id: string;
  readonly option_text: string;
  readonly is_correct: boolean;
  readonly order_no: number;
}

export interface CQPart {
  readonly id: string;
  readonly question_id: string;
  readonly part_key: string;
  readonly question_text: string;
  readonly answer_text?: string;
  readonly marks: number;
  readonly order_no: number;
}

export interface Question {
  readonly id: string;
  readonly type: "mcq" | "cq";
  readonly source: string;
  readonly standard: string;
  readonly question_text: string;
  readonly explanation?: string;
  readonly topic_id?: string;
  readonly mcq_options?: readonly MCQOption[];
  readonly cq_parts?: readonly CQPart[];
}

export interface CreateQuestionPayload {
  readonly subjectId: string;
  readonly chapterId: string;
  readonly type: "mcq" | "cq";
  readonly source:
    | "frostfoe"
    | "varsity"
    | "engineering"
    | "board"
    | "custom_csv_json";
  readonly standard: "board" | "varsity" | "engineering" | "medical";
  readonly year?: number;
  readonly institution?: string;
  readonly questionText: string;
  readonly explanation?: string;
  readonly mcqOptions?: readonly { optionText: string; isCorrect: boolean }[];
  readonly cqParts?: readonly {
    partKey: string;
    questionText: string;
    answerText?: string;
    marks: number;
  }[];
}
