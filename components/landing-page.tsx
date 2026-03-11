import Link from "next/link";
import { CalendarClock, ChartNoAxesCombined, UsersRound } from "lucide-react";
import { CreateMeetingForm } from "@/components/create-meeting-form";
import { ThemeToggle } from "@/components/theme-toggle";

const features = [
  {
    title: "한눈에 보는 주간 조율",
    description: "링크 하나로 참여자를 모으고, 채팅으로 시간을 맞추는 반복을 줄이세요.",
    icon: CalendarClock
  },
  {
    title: "실시간 겹침 분석",
    description: "참여자가 가능한 시간을 입력하면 히트맵이 바로 갱신되어 최적의 시간이 드러납니다.",
    icon: ChartNoAxesCombined
  },
  {
    title: "팀을 위한 미팅 운영",
    description: "프로덕트 팀, 고객 미팅, 동아리, 정기 위원회까지 다양한 일정 조율에 맞게 동작합니다.",
    icon: UsersRound
  }
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_30%)]" />
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="mb-14 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              MeetSync
            </Link>
            <ThemeToggle />
          </div>
          <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
            <div className="fade-up">
              <div className="mb-6 inline-flex rounded-full border border-border/70 bg-card/85 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-muted-foreground">
                회의 시간 조율 SaaS
              </div>
              <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-balance sm:text-6xl">
                MeetSync — 가장 빠른 미팅 시간 찾기
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                여러 사람의 가능한 시간을 한 번에 확인하고 가장 적합한 미팅 시간을 찾으세요.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#create"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  미팅 만들기
                </a>
                <a
                  href="#features"
                  className="rounded-full border border-border bg-card/85 px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-primary/40"
                >
                  기능 살펴보기
                </a>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-border/70 bg-card/80 p-4 backdrop-blur">
                  <p className="text-2xl font-semibold">1개 링크</p>
                  <p className="mt-1 text-sm text-muted-foreground">참여자 공유만으로 바로 시작</p>
                </div>
                <div className="rounded-3xl border border-border/70 bg-card/80 p-4 backdrop-blur">
                  <p className="text-2xl font-semibold">주간 그리드</p>
                  <p className="mt-1 text-sm text-muted-foreground">월요일부터 일요일까지 직관적으로 선택</p>
                </div>
                <div className="rounded-3xl border border-border/70 bg-card/80 p-4 backdrop-blur">
                  <p className="text-2xl font-semibold">실시간 추천</p>
                  <p className="mt-1 text-sm text-muted-foreground">겹치는 시간을 바로 확인</p>
                </div>
              </div>
            </div>
            <div id="create">
              <CreateMeetingForm />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map(({ title, description, icon: Icon }, index) => (
            <article
              key={title}
              className="fade-up rounded-[28px] border border-border/70 bg-card/85 p-6 backdrop-blur transition hover:-translate-y-1 hover:shadow-glow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 inline-flex rounded-2xl bg-muted p-3 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
