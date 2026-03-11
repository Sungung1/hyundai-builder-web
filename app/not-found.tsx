import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md rounded-[32px] border border-border/70 bg-card/90 p-8 text-center shadow-glow">
        <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground">
          미팅을 찾을 수 없습니다
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          요청한 미팅 방이 존재하지 않습니다.
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          링크가 잘못되었거나, 만료되었거나, 아직 생성되지 않았을 수 있습니다.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          미팅 만들기
        </Link>
      </div>
    </main>
  );
}
