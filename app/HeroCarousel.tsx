"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDES = [
  { src: "/imageye___-_imgi_18_massage.png", alt: "Swedish relaxation massage" },
  { src: "/imageye___-_imgi_19_massg.png", alt: "Aromatherapy oil massage" },
  { src: "/imageye___-_imgi_20_mass.png", alt: "Hot stone therapy" },
];

const SLIDE_DURATION = 4500;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
      setTick((t) => t + 1);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative isolate aspect-[4/5] w-full overflow-hidden rounded-t-[999px] rounded-b-3xl bg-brand-green/10">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "z-10 opacity-100" : "z-0 opacity-0"
          }`}
        >
          <div
            key={i === index ? tick : "idle"}
            className="h-full w-full"
            style={
              i === index
                ? { animation: `kenburns ${SLIDE_DURATION + 1000}ms ease-out forwards` }
                : undefined
            }
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(min-width: 1024px) 448px, 100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
