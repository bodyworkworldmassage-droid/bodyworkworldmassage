"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const POOL = [
  { src: "/1.webp", alt: "Deep tissue therapy session" },
  { src: "/2.webp", alt: "Swedish relaxation session" },
  { src: "/3.webp", alt: "Sports recovery session" },
  { src: "/4.webp", alt: "Myofascial release session" },
  { src: "/5.webp", alt: "Prenatal massage session" },
  { src: "/6.webp", alt: "Mobile massage session" },
];

const VISIBLE = 3;
const ITEM_WIDTH = 320;
const GAP = 24;
const STEP = ITEM_WIDTH + GAP;
const SLIDE_DURATION = 3000;
const TRANSITION_MS = 600;

const TRACK = [...POOL, ...POOL.slice(0, VISIBLE)];

export default function OvalCarousel() {
  const [index, setIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => i + 1);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (index !== POOL.length) return;
    const timeout = setTimeout(() => {
      setWithTransition(false);
      setIndex(0);
    }, TRANSITION_MS);
    return () => clearTimeout(timeout);
  }, [index]);

  useEffect(() => {
    if (withTransition) return;
    const raf = requestAnimationFrame(() => setWithTransition(true));
    return () => cancelAnimationFrame(raf);
  }, [withTransition]);

  return (
    <div
      className="mx-auto overflow-hidden sm:mx-0"
      style={{ width: VISIBLE * ITEM_WIDTH + (VISIBLE - 1) * GAP }}
    >
      <div
        className="flex"
        style={{
          gap: GAP,
          transform: `translateX(-${index * STEP}px)`,
          transition: withTransition ? `transform ${TRANSITION_MS}ms ease-out` : "none",
        }}
      >
        {TRACK.map((photo, i) => (
          <div
            key={i}
            className="relative h-60 w-80 flex-shrink-0 overflow-hidden rounded-[50%]"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="360px"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
