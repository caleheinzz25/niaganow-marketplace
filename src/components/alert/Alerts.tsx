import type { Component } from "solid-js";
import { createSignal, createEffect, onCleanup } from "solid-js";
import { AlertType } from "~/types/alert";

export interface AlertItemProps {
  id: string;
  type: AlertType;
  message: string;
  timeOut: number; // in milliseconds
  onClose: () => void;
}

export const AlertItem: Component<AlertItemProps> = (props) => {
  const [progress, setProgress] = createSignal(100); // percent

  createEffect(() => {
    const intervalMs = 50;
    const total = props.timeOut;
    const decrement = (intervalMs / total) * 100;

    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p - decrement;
        if (next <= 0) {
          clearInterval(interval);
          props.onClose(); // auto-close when timeout reaches 0
        }
        return Math.max(next, 0);
      });
    }, intervalMs);

    onCleanup(() => clearInterval(interval));
  });

  return (
    <div
      class={`relative alert show p-4 rounded-lg shadow-md text-white mb-2 overflow-hidden ${
        {
          success: "bg-green-500",
          warning: "bg-yellow-500",
          error: "bg-red-500",
          info: "bg-blue-500",
        }[props.type]
      }`}
    >
      <div class="flex justify-between items-center">
        <span>{props.message}</span>
        <button class="ml-4 text-xl leading-none" onClick={props.onClose}>
          ×
        </button>
      </div>
      {/* underline progress bar */}
      <div
        class="absolute bottom-0 left-0 h-1 bg-white"
        style={{
          width: `${progress()}%`,
          transition: "width 50ms linear",
        }}
      ></div>
    </div>
  );
};
