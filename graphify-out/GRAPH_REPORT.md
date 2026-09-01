# Graph Report - square  (2026-09-01)

## Corpus Check
- 269 files · ~201,046 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1316 nodes · 3206 edges · 109 communities (56 shown, 42 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Poll & Quiz System
- UI Component Library
- Question Bank Management
- Online Exam Engine
- Batch & Course Management
- UI Component Library
- Poll & Quiz System
- Database Schema & ORM
- Question Bank Management
- Database Schema & ORM
- Poll & Quiz System
- Project Config & Tooling
- Batch & Course Management
- Database Schema & ORM
- Poll & Quiz System
- Question Bank Management
- Question Bank Management
- UI Component Library
- Database Schema & ORM
- UI Component Library
- Question Bank Management
- Batch & Course Management
- UI Component Library
- UI Component Library
- Core Module 24
- Question Bank Management
- Core Module 26
- UI Component Library
- UI Component Library
- Question Bank Management
- Question Bank Management
- Question Bank Management
- Authentication & Sessions
- UI Component Library
- UI Component Library
- UI Component Library
- Online Exam Engine
- UI Component Library
- Authentication & Sessions
- Online Exam Engine
- Batch & Course Management
- Online Exam Engine
- Question Bank Management
- UI Component Library
- UI Component Library
- Question Bank Management
- UI Component Library
- UI Component Library
- Question Bank Management
- Core Module 49
- UI Component Library
- UI Component Library
- Online Exam Engine
- UI Component Library
- Database Schema & ORM
- UI Component Library
- UI Component Library
- UI Component Library
- Core Module 59
- Core Module 60
- Batch & Course Management
- UI Component Library
- Project Config & Tooling
- Project Config & Tooling
- Authentication & Sessions
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Database Schema & ORM
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Project Config & Tooling
- Authentication & Sessions

## God Nodes (most connected - your core abstractions)
1. `cn()` - 348 edges
2. `Button()` - 72 edges
3. `Spinner()` - 37 edges
4. `db` - 30 edges
5. `Input()` - 29 edges
6. `auth` - 26 edges
7. `ResponsiveDialog()` - 21 edges
8. `compilerOptions` - 16 edges
9. `DeleteConfirmDialog()` - 15 edges
10. `Question` - 15 edges

## Surprising Connections (you probably didn't know these)
- `FeatureCard()` --calls--> `cn()`  [EXTRACTED]
  src/components/feature-section.tsx → src/lib/utils.ts
- `FeatureTitle()` --calls--> `cn()`  [EXTRACTED]
  src/components/feature-section.tsx → src/lib/utils.ts
- `FeatureDescription()` --calls--> `cn()`  [EXTRACTED]
  src/components/feature-section.tsx → src/lib/utils.ts
- `AlertDialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `AlertDialogContent()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (109 total, 42 thin omitted)

### Community 0 - "Poll & Quiz System"
Cohesion: 0.06
Nodes (69): AdminPdfPage(), AdminQbManager(), AdminQuestionsManager(), AdminQuestionsManagerProps, EnrollmentRequestRow, EnrollmentRequestsListProps, EditQuestionForm(), cleanJsonInput() (+61 more)

### Community 1 - "UI Component Library"
Cohesion: 0.05
Nodes (49): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Carousel() (+41 more)

### Community 2 - "Question Bank Management"
Cohesion: 0.06
Nodes (52): CourseDetailPage(), CourseDetailPageProps, dynamic, CourseDetailPageProps, dynamic, MyCourseClassroomPage(), BatchClassesTab(), getYouTubeEmbedUrl() (+44 more)

### Community 3 - "Online Exam Engine"
Cohesion: 0.06
Nodes (25): nextConfig, !.next, ExamLeaderboardPage(), LoginForm(), MenuItemProps, ProfileMenu(), ProfileBadgeProps, ProfileSidebar() (+17 more)

### Community 4 - "Batch & Course Management"
Cohesion: 0.10
Nodes (36): AdminExamsPage(), PrintCalendarContent(), CalendarPage(), AdminSlidersManager(), Card(), CardAction(), CardContent(), CardDescription() (+28 more)

### Community 5 - "UI Component Library"
Cohesion: 0.06
Nodes (40): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), Sidebar() (+32 more)

### Community 6 - "Poll & Quiz System"
Cohesion: 0.05
Nodes (38): dynamic, dynamic, EnrollmentRequestsList(), batchDetailsRelations, batchEnrollmentRequests, batchEnrollmentRequestsRelations, batchEnrollments, batchEnrollmentsRelations (+30 more)

### Community 7 - "Database Schema & ORM"
Cohesion: 0.05
Nodes (39): babel-plugin-react-compiler, @biomejs/biome, drizzle-kit, devDependencies, babel-plugin-react-compiler, @biomejs/biome, drizzle-kit, postgres (+31 more)

### Community 8 - "Question Bank Management"
Cohesion: 0.15
Nodes (21): NewChapterForm(), NewChapterFormProps, NewQuestionBankForm(), NewQuestionBankFormProps, NewQuestionFormProps, NewSubjectForm(), NewSubjectFormProps, NewTopicForm() (+13 more)

### Community 9 - "Database Schema & ORM"
Cohesion: 0.06
Nodes (32): source, assist, actions, css, parser, next, react, files (+24 more)

### Community 10 - "Poll & Quiz System"
Cohesion: 0.14
Nodes (13): BatchExamEditModalProps, ExamEditorModal(), ExamEditorModalProps, ImportQuestionsFormProps, CheckoutModalProps, CourseItem, ExamOverviewDialog(), ExamSubmitDialog() (+5 more)

### Community 11 - "Project Config & Tooling"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, **/*.ts (+20 more)

### Community 12 - "Batch & Course Management"
Cohesion: 0.08
Nodes (22): BatchDetailPage(), NewBatchPage(), handleSubmit(), AdminBatchesPage(), BatchDetailView(), BatchExamEditModal(), handleSubmit(), BatchExamsTab() (+14 more)

### Community 13 - "Database Schema & ORM"
Cohesion: 0.07
Nodes (26): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+18 more)

### Community 14 - "Poll & Quiz System"
Cohesion: 0.13
Nodes (21): PollConfigPage(), loadChapters(), loadSubjects(), PollSolvePage(), toBengaliNumber(), PollTakePage(), pollOptions, pollVotes (+13 more)

### Community 15 - "Question Bank Management"
Cohesion: 0.21
Nodes (16): AdminContainersManagerProps, AdminItemsManagerProps, AdminSubitemsManagerProps, AdminTopicsManager(), AdminTopicsManagerProps, gapMap, gridCols, QuickList() (+8 more)

### Community 16 - "Question Bank Management"
Cohesion: 0.15
Nodes (8): AdminItemsManager(), AdminSubitemsManager(), db, queryClient, account, containers, items, subitems

### Community 17 - "UI Component Library"
Cohesion: 0.11
Nodes (19): Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator() (+11 more)

### Community 18 - "Database Schema & ORM"
Cohesion: 0.15
Nodes (14): AdminSlidersPage(), dynamic, { GET, POST }, LandingHomePage(), dynamic, MyCoursesPage(), siteSettings, getMyCourses() (+6 more)

### Community 19 - "UI Component Library"
Cohesion: 0.13
Nodes (17): ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Item(), ItemActions(), ItemContent(), ItemDescription() (+9 more)

### Community 20 - "Question Bank Management"
Cohesion: 0.12
Nodes (17): EXAMS, AppBadgeChipProps, BatchMember, DownloadMacButtonProps, Exam, ExamResponse, LayoutProps, LoginFormProps (+9 more)

### Community 21 - "Batch & Course Management"
Cohesion: 0.18
Nodes (11): AdminExamsPage(), AdminExamsList(), AdminExamsListProps, Batch, Exam, TYPE_LABELS, Button(), buttonVariants (+3 more)

### Community 22 - "UI Component Library"
Cohesion: 0.17
Nodes (12): HambergerMenu(), LanguageToggler(), MobileBottomNavProps, Drawer(), DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader() (+4 more)

### Community 23 - "UI Component Library"
Cohesion: 0.12
Nodes (11): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator(), MenubarShortcut() (+3 more)

### Community 24 - "Core Module 24"
Cohesion: 0.16
Nodes (12): dynamic, CoursesPricingSection(), loadCourses(), DEFAULT_IMAGES, HeroSlider(), LandingFooter(), LandingHeader(), ServiceItem (+4 more)

### Community 25 - "Question Bank Management"
Cohesion: 0.16
Nodes (13): ExamResultPage(), ExamQuestionBuilderProps, EditQuestionFormProps, ExamResultResponse, ExamResultSubmission, ExamResultView(), ExamResultViewProps, ExamScoreCard() (+5 more)

### Community 26 - "Core Module 26"
Cohesion: 0.13
Nodes (5): CobeGlobe(), FeatureCard(), FeatureDescription(), features, FeatureTitle()

### Community 27 - "UI Component Library"
Cohesion: 0.12
Nodes (10): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+2 more)

### Community 28 - "UI Component Library"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 29 - "Question Bank Management"
Cohesion: 0.18
Nodes (10): ExamQuestionsPage(), ExamResultsPage(), NewExamPage(), handleSubmit(), handleOpenChange(), examQuestions, createExamAction(), getExamResultsAdmin() (+2 more)

### Community 30 - "Question Bank Management"
Cohesion: 0.15
Nodes (12): dynamic, QbChapterPage(), ChapterQuestionsViewer(), cqParts, mcqOptions, questions, topics, checkQbContainerAccess() (+4 more)

### Community 31 - "Question Bank Management"
Cohesion: 0.30
Nodes (12): AdminContainersManager(), useQuestionMutations(), createContainerAction(), createItemAction(), createSubitemAction(), createTopicAction(), deleteContainerAction(), deleteItemAction() (+4 more)

### Community 32 - "Authentication & Sessions"
Cohesion: 0.32
Nodes (10): AdminSidebar(), Sidebar(), useLogout(), usePasswordLogin(), usePasswordSignUp(), useUser(), getUserAction(), loginWithPasswordAction() (+2 more)

### Community 33 - "UI Component Library"
Cohesion: 0.15
Nodes (9): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogMedia(), AlertDialogOverlay() (+1 more)

### Community 34 - "UI Component Library"
Cohesion: 0.21
Nodes (12): CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions, CarouselPlugin (+4 more)

### Community 35 - "UI Component Library"
Cohesion: 0.21
Nodes (11): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+3 more)

### Community 36 - "Online Exam Engine"
Cohesion: 0.27
Nodes (8): ExamLobbyPage(), TakeExamPage(), examResponses, examSubmissions, checkExamAccess(), getExamBySlug(), ExamSubmission, LeaderboardEntry

### Community 37 - "UI Component Library"
Cohesion: 0.20
Nodes (11): Attachment(), AttachmentAction(), AttachmentActions(), AttachmentContent(), AttachmentDescription(), AttachmentGroup(), AttachmentMedia(), attachmentMediaVariants (+3 more)

### Community 38 - "Authentication & Sessions"
Cohesion: 0.18
Nodes (11): @base-ui/react, better-auth, dependencies, @base-ui/react, better-auth, @phosphor-icons/react, react-resizable-panels, @types/canvas-confetti (+3 more)

### Community 39 - "Online Exam Engine"
Cohesion: 0.29
Nodes (9): ExamsBrowserPage(), LiveExamView(), usePublishedExams(), useStudentExams(), useSubmitExam(), getPublishedExams(), getStudentExams(), submitExamAction() (+1 more)

### Community 40 - "Batch & Course Management"
Cohesion: 0.27
Nodes (8): BatchMembersTabProps, EnrollmentRequestData, EnrollmentRequestRow, ManageEnrollmentModal(), handleApprove(), handleReject(), approveEnrollmentRequest(), rejectEnrollmentRequest()

### Community 41 - "Online Exam Engine"
Cohesion: 0.24
Nodes (9): EditExamFormProps, ExamFormFieldsProps, ExamAccess, ExamLobbyView(), ExamLobbyViewProps, LiveExamViewProps, useStartExam(), startExamAction() (+1 more)

### Community 42 - "Question Bank Management"
Cohesion: 0.29
Nodes (9): ExamQuestionBuilder(), handleAddQuestion(), handleMove(), ExamWithQuestions, ExamOverviewDialogProps, addQuestionToExamAction(), removeQuestionFromExamAction(), reorderExamQuestionsAction() (+1 more)

### Community 43 - "UI Component Library"
Cohesion: 0.20
Nodes (8): Api, Confetti, ConfettiButton, ConfettiButtonProps, ConfettiComponent, ConfettiContext, ConfettiRef, Props

### Community 44 - "UI Component Library"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 45 - "Question Bank Management"
Cohesion: 0.42
Nodes (7): AdminAddQuestionPage(), dynamic, AdminAddQuestionPage(), dynamic, UniversalQuestionCreator(), getFullQbHierarchy(), getRecentUploadedQuestions()

### Community 46 - "UI Component Library"
Cohesion: 0.31
Nodes (6): AnimatedThemeToggler(), AnimatedThemeTogglerProps, getThemeTransitionClipPaths(), polygonCollapsed(), TransitionVariant, ThemeTogglerProps

### Community 47 - "UI Component Library"
Cohesion: 0.36
Nodes (5): Alert(), AlertAction(), AlertDescription(), AlertTitle(), alertVariants

### Community 48 - "Question Bank Management"
Cohesion: 0.32
Nodes (4): dynamic, QuestionBankPage(), batchQbAccess, getUserQbContainers()

### Community 49 - "Core Module 49"
Cohesion: 0.25
Nodes (7): MobileBottomNav(), ADMIN_NAV_ITEMS, getNavItems(), sidebarAnnouncement, USER_NAV_ITEMS, NavItem, SidebarAnnouncement

### Community 50 - "UI Component Library"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 51 - "UI Component Library"
Cohesion: 0.25
Nodes (4): PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle()

### Community 52 - "Online Exam Engine"
Cohesion: 0.38
Nodes (5): EditExamForm(), handleDelete(), handleSubmit(), deleteExamAction(), updateExamAction()

### Community 53 - "UI Component Library"
Cohesion: 0.38
Nodes (6): Bubble(), BubbleContent(), BubbleGroup(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 54 - "Database Schema & ORM"
Cohesion: 0.48
Nodes (5): profiles, useUpdateUserProfile(), useUserProfile(), getUserProfileAction(), updateUserProfileAction()

### Community 55 - "UI Component Library"
Cohesion: 0.50
Nodes (4): Marker(), MarkerContent(), MarkerIcon(), markerVariants

## Knowledge Gaps
- **269 isolated node(s):** `$schema`, `enabled`, `clientKind`, `useIgnoreFile`, `ignoreUnknown` (+264 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 385 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **42 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Component Library` to `Poll & Quiz System`, `Question Bank Management`, `Online Exam Engine`, `Batch & Course Management`, `UI Component Library`, `Question Bank Management`, `Poll & Quiz System`, `Question Bank Management`, `UI Component Library`, `UI Component Library`, `Batch & Course Management`, `UI Component Library`, `UI Component Library`, `Core Module 26`, `UI Component Library`, `UI Component Library`, `UI Component Library`, `UI Component Library`, `UI Component Library`, `UI Component Library`, `UI Component Library`, `UI Component Library`, `UI Component Library`, `UI Component Library`, `UI Component Library`, `UI Component Library`, `UI Component Library`, `UI Component Library`, `UI Component Library`, `UI Component Library`?**
  _High betweenness centrality (0.292) - this node is a cross-community bridge._
- **Why does `Button()` connect `Batch & Course Management` to `Poll & Quiz System`, `UI Component Library`, `Question Bank Management`, `Batch & Course Management`, `UI Component Library`, `Poll & Quiz System`, `Question Bank Management`, `Poll & Quiz System`, `Question Bank Management`, `UI Component Library`, `Database Schema & ORM`, `UI Component Library`, `Core Module 24`, `Question Bank Management`, `Authentication & Sessions`, `UI Component Library`, `UI Component Library`, `UI Component Library`, `Batch & Course Management`, `Online Exam Engine`, `Question Bank Management`, `UI Component Library`, `Online Exam Engine`, `Batch & Course Management`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `!.next` connect `Online Exam Engine` to `Database Schema & ORM`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **What connects `$schema`, `enabled`, `clientKind` to the rest of the system?**
  _269 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Poll & Quiz System` be split into smaller, more focused modules?**
  _Cohesion score 0.0559244126659857 - nodes in this community are weakly interconnected._
- **Should `UI Component Library` be split into smaller, more focused modules?**
  _Cohesion score 0.052884615384615384 - nodes in this community are weakly interconnected._
- **Should `Question Bank Management` be split into smaller, more focused modules?**
  _Cohesion score 0.05952380952380952 - nodes in this community are weakly interconnected._