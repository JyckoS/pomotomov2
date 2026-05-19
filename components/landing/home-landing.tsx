"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import icon from "@/app/icon.png";

const heroLines = {
  brand: "Pomotomo ポモトモ",
  headlineA: "友達とつながりながら、",
  headlineB: "今日の集中を、もっと心地よく。",
  subtitle:
    "ポモドーロ、ノート、ToDo、Daily List をひとつにまとめて、勉強も仕事も軽やかに続けられる作業アプリ。",
} as const;

const features = [
  {
    number: "01",
    title: "集中のリズムが、自然と整う",
    subtitle: "Pomodoro Timer",
    description:
      "集中と休憩を心地よく切り替え。気合いに頼らず、毎日の作業ペースを安定させて、積み上げを続けられます。",
    tint: "from-[#69b4ff]/28 via-[#dff0ff]/12 to-transparent",
    chip: "bg-[#f2f9ff] text-[#005bab]",
  },
  {
    number: "02",
    title: "ひとりの作業が、続けやすくなる",
    subtitle: "Friends",
    description:
      "友達のがんばりが見えるだけで、着手のハードルは下がる。ほどよいつながりが、集中の習慣づくりを支えます。",
    tint: "from-[#9d7dff]/24 via-[#efe9ff]/10 to-transparent",
    chip: "bg-[#f3efff] text-[#5b3ea6]",
  },
  {
    number: "03",
    title: "ノートは、考える流れを止めない",
    subtitle: "Markdown + Image Notes",
    description:
      "Markdown と画像に対応したノートで、メモから整理までスムーズ。あとから見返しても分かりやすく、実用的です。",
    tint: "from-[#2a9d99]/22 via-[#e8fbfa]/10 to-transparent",
    chip: "bg-[#ebfbfa] text-[#1d7b77]",
  },
  {
    number: "04",
    title: "今日やることが、すぐ決まる",
    subtitle: "ToDo + Daily List",
    description:
      "ToDo と Daily List を同じ流れで管理。次にやることの迷いが減って、作業に入るまでの時間を短くできます。",
    tint: "from-[#ff9f57]/24 via-[#fff2e8]/10 to-transparent",
    chip: "bg-[#fff5eb] text-[#a64708]",
  },
] as const;

function useTypedText(text: string, delayMs: number, speedMs: number, disabled: boolean) {
  const characters = useMemo(() => {
    if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
      const segmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });
      return Array.from(segmenter.segment(text), ({ segment }) => segment);
    }

    return Array.from(text);
  }, [text]);

  const [value, setValue] = useState("");

  useEffect(() => {
    if (disabled) {
      return;
    }

    let index = 0;
    let typingTimerId: number | undefined;
    const startTimerId = window.setTimeout(() => {
      const typeNext = () => {
        index += 1;
        setValue(characters.slice(0, index).join(""));
        if (index < characters.length) {
          typingTimerId = window.setTimeout(typeNext, speedMs);
        }
      };

      typeNext();
    }, delayMs);

    return () => {
      window.clearTimeout(startTimerId);
      if (typingTimerId) {
        window.clearTimeout(typingTimerId);
      }
    };
  }, [characters, disabled, delayMs, speedMs]);

  return disabled ? text : value;
}

function useLowPowerMode() {
  return useMemo(() => {
    if (typeof navigator === "undefined") {
      return false;
    }

    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const lowCore = typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4;
    const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
    const saveData = !!nav.connection?.saveData;
    return lowCore || lowMemory || saveData;
  }, []);
}

function TypeCursor({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <motion.span
      className="ml-1 inline-block h-[1em] w-[2px] bg-current align-[-0.1em]"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export function HomeLanding() {
  const reduceMotion = useReducedMotion();
  const isLowPower = useLowPowerMode();
  const useHeavyMotion = !reduceMotion && !isLowPower;

  const brand = useTypedText(heroLines.brand, 140, 42, !!reduceMotion);
  const headingA = useTypedText(heroLines.headlineA, 520, 52, !!reduceMotion);
  const headingB = useTypedText(heroLines.headlineB, 1380, 52, !!reduceMotion);
  const subtitle = useTypedText(heroLines.subtitle, 2380, 28, !!reduceMotion);

  return (
    <main className="overflow-x-hidden bg-[#f8fbff] text-[rgba(0,0,0,0.95)]">
      <section className="relative isolate flex h-[100svh] min-h-[100svh] max-h-[100svh] items-center overflow-hidden px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute -left-24 top-[-14%] h-[26rem] w-[26rem] rounded-full bg-[#2d8fff]/30 blur-3xl [will-change:transform]"
            animate={useHeavyMotion ? { x: [0, 14, 0], y: [0, -10, 0] } : undefined}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[-10rem] top-[6%] h-[27rem] w-[27rem] rounded-full bg-[#7bb7ff]/26 blur-3xl [will-change:transform]"
            animate={useHeavyMotion ? { x: [0, -12, 0], y: [0, 8, 0] } : undefined}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute bottom-[-12rem] left-[22%] h-[24rem] w-[24rem] rounded-full bg-[#6f7cff]/18 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,255,255,0.7),rgba(245,250,255,0.95)_42%,#edf6ff_100%)]" />
          <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(56,130,246,0.2)_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>

        <motion.div
          className="mx-auto h-full w-full max-w-[1200px]"
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="mx-auto flex h-full max-h-[calc(100svh-1.5rem)] w-full max-w-4xl flex-col justify-center rounded-[24px] border border-[#dbeafe] bg-white/80 p-5 text-center shadow-[rgba(10,37,64,0.12)_0px_12px_36px,rgba(44,130,246,0.18)_0px_1px_0px_inset] sm:max-h-[calc(100svh-2rem)] sm:p-8 md:max-h-[calc(100svh-3rem)] md:p-10">
            <motion.div
              className="mb-4 flex items-center justify-center gap-3 sm:mb-6 sm:gap-4"
              initial={reduceMotion ? undefined : { opacity: 0, y: -30 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-3 rounded-full border border-[#bfdbfe] bg-white/85 px-3 py-1.5 shadow-[rgba(59,130,246,0.18)_0px_8px_24px] sm:gap-4 sm:px-5 sm:py-2">
                <Image
                  src={icon}
                  alt="Pomotomo icon"
                  priority
                  className="h-9 w-9 brightness-0 sm:h-12 sm:w-12 md:h-14 md:w-14"
                />
                <p className="text-base font-bold tracking-[-0.04em] text-[#0f172a] sm:text-xl md:text-2xl">
                  {brand}
                  <TypeCursor show={!reduceMotion && brand.length < heroLines.brand.length} />
                </p>
              </div>
            </motion.div>

            <motion.h1
              className="text-[clamp(1.7rem,6.7vw,4.2rem)] font-bold leading-[0.96] tracking-[-0.045em] text-[#0b1f3a]"
              initial={reduceMotion ? undefined : { opacity: 0, y: -36 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
            >
              <span className="block">
                {headingA}
                <TypeCursor show={!reduceMotion && headingA.length < heroLines.headlineA.length} />
              </span>
              <span className="mt-1 block bg-gradient-to-r from-[#0b1f3a] via-[#1e3a8a] to-[#2563eb] bg-clip-text text-transparent">
                {headingB}
                <TypeCursor show={!reduceMotion && headingB.length < heroLines.headlineB.length} />
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-[#334155] sm:mt-4 sm:text-base sm:leading-7 md:text-lg md:leading-8"
              initial={reduceMotion ? undefined : { opacity: 0, y: -24 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.62, duration: 0.65, ease: "easeOut" }}
            >
              {subtitle}
              <TypeCursor show={!reduceMotion && subtitle.length < heroLines.subtitle.length} />
            </motion.p>

            <motion.div
              className="mt-5 flex flex-wrap justify-center gap-2.5 sm:mt-7 sm:gap-3"
              initial={reduceMotion ? undefined : { opacity: 0, y: -20 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.6, ease: "easeOut" }}
            >
              <motion.div whileHover={useHeavyMotion ? { y: -2 } : undefined} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/dashboard"
                  className="inline-flex h-10 items-center rounded-[8px] bg-gradient-to-r from-[#0f5fd8] to-[#0075de] px-5 text-[14px] font-semibold text-white shadow-[rgba(37,99,235,0.45)_0px_12px_24px] transition duration-200 hover:from-[#0c52bb] hover:to-[#005bab] hover:no-underline sm:h-11 sm:px-7 sm:text-[15px]"
                >
                  今すぐはじめる
                </Link>
              </motion.div>
              <motion.div whileHover={useHeavyMotion ? { y: -2 } : undefined} whileTap={{ scale: 0.98 }}>
                <Link
                  href="#features"
                  className="inline-flex h-10 items-center rounded-[8px] border border-[#bfdbfe] bg-white/90 px-5 text-[14px] font-semibold text-[#1e3a8a] transition-colors duration-200 hover:bg-[#eff6ff] hover:no-underline sm:h-11 sm:px-7 sm:text-[15px]"
                >
                  機能を見る
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section
        id="features"
        className="relative border-y border-[#dbeafe] bg-[linear-gradient(120deg,#eaf4ff_0%,#eef6ff_32%,#f5f8ff_68%,#eef7ff_100%)] px-6 py-16 sm:px-8 md:py-24"
      >
        <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(59,130,246,0.24)_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="relative mx-auto w-full max-w-[1200px]">
          <p className="text-sm font-semibold tracking-[0.125px] text-[#475569]">ポモトモとは？</p>
          <h2 className="mt-3 text-[clamp(3.2rem,12vw,7.6rem)] font-bold leading-[0.9] tracking-[-0.06em] text-[#0b1f3a]">
            Features
          </h2>
        </div>
      </section>

      <section className="bg-[#f8fbff] px-6 py-12 sm:px-8 sm:py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-[1200px] gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              className="group relative overflow-hidden rounded-[22px] border border-[#dbeafe] bg-white/92 p-7 shadow-[rgba(37,99,235,0.08)_0px_10px_30px] md:min-h-[50vh] md:p-12"
              initial={reduceMotion ? undefined : { opacity: 0, y: 22 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.42, delay: index * 0.04, ease: "easeOut" }}
              whileHover={useHeavyMotion ? { y: -2 } : undefined}
            >
              <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${feature.tint}`} />
              <div className="md:flex md:items-start md:gap-12">
                <div className="mb-6 md:mb-0">
                  <span className="inline-flex rounded-full border border-[#bfdbfe] bg-white/90 px-3 py-1 text-xs font-semibold tracking-[0.125px] text-[#334155]">
                    {feature.number}
                  </span>
                </div>
                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-[0.125px] ${feature.chip}`}
                  >
                    {feature.subtitle}
                  </span>
                  <h3 className="mt-4 text-[clamp(1.8rem,4.8vw,3.35rem)] font-bold leading-[1.03] tracking-[-0.035em] text-[#0b1f3a]">
                    {feature.title}
                  </h3>
                  <p className="mt-4 max-w-3xl text-base leading-7 text-[#475569] sm:text-lg sm:leading-8">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
