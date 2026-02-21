import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { X, MessageCircle } from "lucide-react";
import { use_coach_store } from "@/stores/coach-store";
import type { CoachEmotion } from "@/types/coach";

const EMOTION_IMAGE: Record<CoachEmotion, string> = {
  idle: "/opo_peek.png",
  happy: "/opo_wave.png",
  worried: "/opo_worried.png",
  celebrating: "/opo_celebrate.png",
  encouraging: "/opo_encouraging.png",
};

/** Emotions whose PNG already faces left (toward screen center) and don't need CSS flip */
const NO_FLIP: Set<CoachEmotion> = new Set(["worried"]);

const ALL_EMOTIONS: CoachEmotion[] = ["idle", "happy", "worried", "celebrating", "encouraging"];
let emotion_index = 0;

function trigger_fab_message() {
  const store = use_coach_store.getState();
  if (store.is_visible) return;
  const emotion = ALL_EMOTIONS[emotion_index % ALL_EMOTIONS.length];
  emotion_index++;
  store.show_message({
    id: `test-${Date.now()}`,
    trigger: "app_entry",
    title: `Emoción: ${emotion}`,
    body: `Probando la pose de "${emotion}" con imagen ${EMOTION_IMAGE[emotion]}`,
    emotion,
    action: { label: "Siguiente", to: "" },
  });
}

export function CoachOverlay() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const is_visible = use_coach_store((s) => s.is_visible);
  const current_message = use_coach_store((s) => s.current_message);
  const emotion = use_coach_store((s) => s.emotion);
  const dismiss = use_coach_store((s) => s.dismiss);
  const [mascot_in, set_mascot_in] = useState(false);
  const [bubble_in, set_bubble_in] = useState(false);

  // Step 1: mascot slides in
  useEffect(() => {
    if (is_visible) {
      const t = requestAnimationFrame(() => set_mascot_in(true));
      return () => cancelAnimationFrame(t);
    }
    set_mascot_in(false);
    set_bubble_in(false);
  }, [is_visible]);

  // Step 2: bubble appears AFTER mascot finishes entering (600ms)
  useEffect(() => {
    if (mascot_in) {
      const t = setTimeout(() => set_bubble_in(true), 500);
      return () => clearTimeout(t);
    }
    set_bubble_in(false);
  }, [mascot_in]);

  const handle_action = useCallback(() => {
    if (current_message?.action?.to) {
      navigate(current_message.action.to);
    }
    dismiss();
  }, [current_message, dismiss, navigate]);

  const handle_dismiss = useCallback(() => {
    set_bubble_in(false);
    setTimeout(() => set_mascot_in(false), 150);
    setTimeout(dismiss, 600);
  }, [dismiss]);

  const mascot_src = EMOTION_IMAGE[emotion] ?? EMOTION_IMAGE.idle;
  const needs_flip = !NO_FLIP.has(emotion);

  // FAB — bottom-left
  if (!is_visible && !mascot_in) {
    return (
      <button
        onClick={trigger_fab_message}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-700 active:scale-95 shadow-lg flex items-center justify-center transition-all duration-200 ease-out"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] transition-all ease-out ${
          mascot_in
            ? "bg-black/15 backdrop-blur-sm"
            : "bg-transparent backdrop-blur-0 pointer-events-none"
        }`}
        style={{ transitionDuration: "400ms" }}
        onClick={handle_dismiss}
      />

      {/* Mascot — slides in from right */}
      <img
        src={mascot_src}
        alt="Coach mascota"
        className={`fixed z-[70] right-0 top-1/2 -translate-y-1/2 w-56 sm:w-72 drop-shadow-2xl transition-all ease-out ${
          needs_flip ? "-scale-x-100" : ""
        } ${
          mascot_in
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-full"
        }`}
        style={{ transitionDuration: "600ms" }}
      />

      {/* Speech bubble — appears after mascot is in */}
      <div
        className={`fixed z-[70] top-1/2 -translate-y-1/2 transition-all ease-out ${
          bubble_in
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95"
        }`}
        style={{
          right: "clamp(13rem, 18vw, 18rem)",
          transitionDuration: "400ms",
        }}
      >
        <div className="relative w-72 sm:w-80 bg-card rounded-2xl shadow-2xl border border-border p-5">
          <button
            onClick={handle_dismiss}
            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <p className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-1.5">
            {t('coach.title')}
          </p>
          <h3 className="text-sm font-bold text-foreground mb-1.5 pr-6">
            {current_message?.title ?? ""}
          </h3>
          <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
            {current_message?.body ?? ""}
          </p>

          <div className="flex gap-2">
            {current_message?.action && (
              <Button
                size="sm"
                onClick={handle_action}
                className="font-semibold text-xs h-8"
              >
                {current_message.action.label}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handle_dismiss}
              className="text-xs h-8 text-muted-foreground"
            >
              {t('coach.dismiss')}
            </Button>
          </div>

          {/* Triangle pointing right */}
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-card border-r border-t border-border rotate-45" />
        </div>
      </div>
    </>
  );
}
