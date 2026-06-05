// src/shared/ui/CourseLink.tsx
"use client";

import { track } from "@/shared/lib/track";

const COURSE_URL = "https://stepik.org/a/286841/pay?promo=5ac9cd379a3bc446";
const TRACK_SRC = "EventMap Course";

export function CourseLink() {
  return (
    <a
      className="nav__course-link"
      href={COURSE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("open_course", TRACK_SRC)}
    >
      Курс
    </a>
  );
}