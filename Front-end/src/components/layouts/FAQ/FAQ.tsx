"use client";

import styles from "./FAQ.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQprops {
  id: string; // Use 'number' if IDs are numeric in your JSON
  question: string;
  answer: string;
}

function FAQ() {
  const [FAQ, setFAQ] = useState<FAQprops[]>([]);

  useEffect(() => {
    fetch("/data/FAQ.json")
      .then((response) => response.json())
      .then((data) => setFAQ(data))
      .catch((error) => console.error("Error loading FAQ data:", error));
  }, []);

  return (
    <div className={cx("wrapper", "text-center")}>
      <div className={cx("title", "text-title")}>
        Frequently Asked Questions
      </div>

      <Accordion
        type="single"
        collapsible
        className={cx("md:w-3/4", "lg:w-1/2", "mx-auto")}
      >
        {FAQ.map((item, index) => (
          <AccordionItem
            value={`item-${item.id}`}
            className={cx("accordion")}
            key={index}
          >
            <AccordionTrigger className={cx("accordion-title", "text-title")}>
              {item.question}
            </AccordionTrigger>
            <AccordionContent
              className={cx("accordion-description", "text-description")}
            >
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default FAQ;
