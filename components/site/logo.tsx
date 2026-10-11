import Image from "next/image";
import Link from "next/link";

export function LogoMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return <Image src="/cv.png" alt="" aria-hidden width={size} height={size} className={className} priority />;
}

export function Logo() {
  return (
    <Link href="/" className="focus-ring -m-1 flex items-center gap-2.5 rounded-control p-1" aria-label="VibeJudge home">
      <LogoMark />
      <span className="font-display text-[19px] font-semibold tracking-tight text-ink">VibeJudge</span>
    </Link>
  );
}
