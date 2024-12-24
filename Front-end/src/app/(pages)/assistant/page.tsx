"use client";
import React from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import VideoStreaming from "./GestureRecognition/VideoStreaming";
import classNames from "classnames/bind";
import styles from "./Assistant.module.scss";

const cx = classNames.bind(styles);

export default function Assistant() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <Header />
      </div>

      <main className={cx("content")}>
        <h1 className={cx("title")}>Hand Sign Recognition</h1>
        <VideoStreaming />
      </main>

      <Footer />
    </div>
  );
}
