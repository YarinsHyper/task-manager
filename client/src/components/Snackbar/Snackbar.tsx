import { useEffect, useRef, useState } from "react";
import type { Notice } from "../../types/notice";

interface Props {
  notice: Notice | null;
  onDismiss: () => void;
}

const EXIT_MS = 200;

// Keeps rendering the last notice through its exit transition instead of
// unmounting the instant `notice` goes null (that abrupt unmount was the
// flicker). The slide-in only plays going from fully hidden to visible;
// a new notice replacing another while already open just swaps text and
// fades it in, it doesn't repeat the slide.
export default function Snackbar({ notice, onDismiss }: Props) {
  const [displayed, setDisplayed] = useState<Notice | null>(null);
  const [open, setOpen] = useState(false);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (notice) {
      setDisplayed(notice);
      if (!wasOpenRef.current) {
        // First appearance: render closed for one frame, then flip open, so
        // the browser has two distinct states to transition between.
        wasOpenRef.current = true;
        setOpen(false);
        const raf = requestAnimationFrame(() => setOpen(true));
        return () => cancelAnimationFrame(raf);
      }
      setOpen(true);
      return;
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      setOpen(false);
      const timeout = setTimeout(() => setDisplayed(null), EXIT_MS);
      return () => clearTimeout(timeout);
    }
  }, [notice]);

  if (!displayed) return null;

  return (
    <div
      className={`snackbar snackbar-${displayed.type} ${open ? "snackbar-open" : "snackbar-closed"}`}
      role="alert"
    >
      <span key={displayed.message} className="snackbar-message">
        {displayed.message}
      </span>
      <button
        type="button"
        className="snackbar-dismiss"
        onClick={onDismiss}
        aria-label="Dismiss"
      >
        &times;
      </button>
    </div>
  );
}
