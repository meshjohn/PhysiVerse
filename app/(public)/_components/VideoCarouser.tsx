"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

import { useEffect, useRef, useState } from "react";

import {
  pauseImg,
  playImg,
  replayImg,
  hightlightsSlides,
} from "@/lib/constants";

const VideoCarousel = () => {
  const videoRef = useRef<(HTMLVideoElement | null)[]>([]);
  const videoSpanRef = useRef<(HTMLSpanElement | null)[]>([]);
  const videoDivRef = useRef<(HTMLSpanElement | null)[]>([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState<Event[]>([]);
  const { isLastVideo, startPlay, videoId, isPlaying } = video;

  // Animate slider when videoId changes
  useGSAP(() => {
    const slider = document.getElementById("slider-wrapper");
    if (!slider) return;

    const items = slider.querySelectorAll(".slider-item");
    if (!items.length) return;

    const currentItem = items[videoId] as HTMLElement;
    if (!currentItem) return;

    let offset = currentItem.offsetWidth * videoId;

    // Last slide offset adjustments for different screen sizes
    if (videoId === items.length - 1) {
      if (window.innerWidth < 640) {
        offset =
          (videoId - 1) * currentItem.offsetWidth + currentItem.offsetWidth * 1;
      } else if (window.innerWidth < 1024) {
        offset =
          (videoId - 1) * currentItem.offsetWidth +
          currentItem.offsetWidth * 0.95;
      } else {
        offset =
          (videoId - 1) * currentItem.offsetWidth +
          currentItem.offsetWidth * 0.9;
      }
    }

    gsap.to("#slider-wrapper", {
      x: -offset,
      duration: 1.8,
      ease: "power2.inOut",
    });
  }, [videoId]);

  // Setup scroll triggers once
  useGSAP(() => {
    videoRef.current.forEach((vid, i) => {
      if (!vid) return;
      ScrollTrigger.create({
        trigger: vid,
        start: "top+=80 center",
        toggleActions: "play none none none",
        once: true, // ensures it only fires once when scrolled into view
        onEnter: () => {
          if (i === videoId) {
            setVideo((pre) => ({
              ...pre,
              startPlay: true,
              isPlaying: true,
            }));
            vid.play().catch(() => {});
          }
        },
      });
    });
  }, []);

  // Progress bar animation (synced with real video time)
  useEffect(() => {
    const vid = videoRef.current[videoId];
    const spanEl = videoSpanRef.current[videoId];
    const divEl = videoDivRef.current[videoId];

    if (!vid || !spanEl || !divEl) return;

    const updateProgress = () => {
      if (vid.duration) {
        const progress = (vid.currentTime / vid.duration) * 100;

        gsap.to(spanEl, {
          width: `${progress}%`,
          backgroundColor: "#ffffff",
          overwrite: "auto",
        });

        gsap.to(divEl, {
          width:
            window.innerWidth < 640
              ? "8px"
              : window.innerWidth < 1024
                ? "12px"
                : "14px",
          overwrite: "auto",
        });
      }
    };

    vid.addEventListener("timeupdate", updateProgress);

    // reset when video ends
    vid.addEventListener("ended", () => {
      gsap.to(divEl, { width: "12px" });
      gsap.to(spanEl, { backgroundColor: "#afafaf" });
    });

    return () => {
      vid.removeEventListener("timeupdate", updateProgress);
    };
  }, [videoId, startPlay, isPlaying]);

  // Handle video play/pause
  useEffect(() => {
    const vid = videoRef.current[videoId];
    if (!vid) return;

    if (!isPlaying) {
      vid.pause();
    } else {
      if (startPlay) {
        vid.play().catch((err) => {
          console.warn("Autoplay blocked:", err);
        });
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);
  // Actions
  const handleProcess = (type: string, i?: number) => {
    switch (type) {
      case "video-end":
        if (i !== undefined && i + 1 < hightlightsSlides.length) {
          setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
        } else {
          handleProcess("video-last");
        }
        break;
      case "video-last":
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;
      case "video-reset":
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
        break;
      case "pause":
        setVideo((pre) => ({ ...pre, isPlaying: false }));
        break;
      case "play":
        setVideo((pre) => ({ ...pre, isPlaying: true }));
        break;
      default:
        return video;
    }
  };

  const handleLoadedMetaData = (i: number, e: Event) =>
    setLoadedData((pre) => [...pre, e]);

  return (
    <>
      <div id="slider-wrapper" className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} className={`slider-item pl-0 sm:pr-10 pr-8`}>
            <div className="video-carousel_container relative w-[90vw] sm:w-[70vw] md:w-[60vw] h-[50vh] sm:h-[50vh] md:h-[70vh] xl:h-[75vh] flex-center rounded-3xl overflow-hidden bg-black">
              <video
                id={`video-${i}`}
                playsInline
                autoPlay={i === 0}
                muted
                preload="auto"
                className="w-full h-full object-cover pointer-events-none"
                ref={(el: HTMLVideoElement | null) => { videoRef.current[i] = el; }}
                onEnded={() =>
                  handleProcess(
                    i + 1 < hightlightsSlides.length
                      ? "video-end"
                      : "video-last",
                    i
                  )
                }
                onPlay={() => setVideo((pre) => ({ ...pre, isPlaying: true }))}
                onLoadedMetadata={(e) => handleLoadedMetaData(i, e.nativeEvent)}
              >
                <source src={list.video} type="video/mp4" />
              </video>

              <div className="absolute top-4 sm:top-12 left-[5%] z-10">
                {list.textLists.map((text, j) => (
                  <p key={j} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicators + controls */}
      <div className="relative flex items-center justify-center mt-6 sm:mt-10">
        <div
          className="flex justify-center items-center py-4 px-6 sm:py-5 sm:px-7 bg-gradient-to-r from-gray-700 to-gray-900
 backdrop-blur rounded-full"
        >
          {hightlightsSlides.map((_, i) => (
            <span
              key={i}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer overflow-hidden"
              ref={(el) => {
                videoDivRef.current[i] = el;
              }}
            >
              <span
                className="absolute h-full w-0 rounded-full bg-white transition-all duration-200"
                ref={(el) => {
                  videoSpanRef.current[i] = el;
                }}
              />
            </span>
          ))}
        </div>

        <button className="ml-4 p-3 sm:p-4 rounded-full bg-gray-900 backdrop-blur flex items-center justify-center">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={() =>
              isLastVideo
                ? handleProcess("video-reset")
                : !isPlaying
                  ? handleProcess("play")
                  : handleProcess("pause")
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
