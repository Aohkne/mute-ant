"use client";

import styles from "./Hero.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import { useEffect, useRef } from "react";
import Typed from "typed.js";
import { Button } from "@/components/ui/button";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

function Hero() {
  const textRef = useRef(null);

  useEffect(() => {
    const options = {
      strings: ["Understanding", "Connection", "Communication"],
      typeSpeed: 200,
      backSpeed: 200,
      backDelay: 500,
      startDelay: 300,
      loop: true,
      showCursor: false,
    };

    if (textRef.current) {
      const typed = new Typed(textRef.current, options);

      // Clean up when component unmounts
      return () => {
        typed.destroy();
      };
    }
  }, []);

  return (
    <div className={cx("wrapper", "text-center")}>
      <div className={cx("title", "text-title")}>From Signs to</div>
      <div className={cx("subtitle")}>
        {/* Typing */}
        <div className={cx("hero-text")}>
          <span
            ref={textRef}
            className={cx("text-auto", "text-gradient-3")}
          ></span>
        </div>
      </div>

      <div className={cx("description", "text-description", "mx-auto", "my-8")}>
        Let&apos;s explore the world of sign language, where communication knows
        no bounds and every gesture tells a meaningful story, creating new
        connections between people.
      </div>

      <Link href={"/assistant"}>
        <div
          className={cx(
            "hero-action",
            "bg-gradient-3",
            "title",
            "flex",
            "items-center",
            "mx-auto"
          )}
        >
          <div className={cx("hero-circle")}></div>
          <Button className={cx("hero-btn")}>Get started</Button>
          <ChevronRight className={cx("hero-icon")} />
        </div>
      </Link>
    </div>
  );
}

export default Hero;
