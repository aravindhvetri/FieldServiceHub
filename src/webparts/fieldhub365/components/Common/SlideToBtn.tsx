import * as React from "react";
import { useRef, useState, useEffect } from "react";
import styles from "./SlideToBtn.module.scss";

interface SlideToStartProps {
  startJobFunction: () => void;
}

const SlideToStart: React.FC<SlideToStartProps> = ({ startJobFunction }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const swipeRef = useRef<HTMLSpanElement>(null);

  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [maxX, setMaxX] = useState(0);
  const [startX, setStartX] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (buttonRef.current && swipeRef.current) {
      const padding = 20;
      const max =
        buttonRef.current.offsetWidth - swipeRef.current.offsetWidth - padding;

      setMaxX(max);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const diff = Math.min(Math.max(e.clientX - startX, 0), maxX);
    setDragX(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    setIsDragging(false);

    if (dragX >= maxX) {
      setDragX(maxX);
      setCompleted(true);
      startJobFunction();
      console.log("Started");
    } else {
      setDragX(0);
      setCompleted(false);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  return (
    <button
      ref={buttonRef}
      className={`${styles.button} ${completed ? styles.order : ""}`}
      style={
        {
          display: completed ? "none" : "flex",
          "--swiped-blur": dragX / maxX,
          "--swiped": completed ? 1 : 0,
        } as React.CSSProperties
      }
    >
      <div className={styles.inner}>
        <span
          ref={swipeRef}
          className={styles.swipeBtn}
          style={{ transform: `translateX(${dragX}px)` }}
          onMouseDown={handleMouseDown}
        >
          {">>"}
        </span>
      </div>

      <div className="result"></div>
    </button>
  );
};

export default SlideToStart;
