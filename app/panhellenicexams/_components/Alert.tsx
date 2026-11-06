import type { ReactNode } from "react";
import { AlertIcon, CheckIcon, InfoIcon } from "./icons";

type Tone = "error" | "info" | "success";

const STYLES: Record<Tone, string> = {
  error: "border-danger/40 bg-danger-soft text-danger",
  info: "border-navy/20 bg-mist text-navy",
  success: "border-emerald-700/30 bg-emerald-50 text-emerald-900",
};

const ICONS: Record<Tone, ReactNode> = {
  error: <AlertIcon className="mt-0.5 size-5 shrink-0" />,
  info: <InfoIcon className="mt-0.5 size-5 shrink-0" />,
  success: <CheckIcon className="mt-0.5 size-5 shrink-0" />,
};

export function Alert({
  tone,
  children,
  className = "",
}: {
  tone: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex gap-3 rounded-lg border p-4 text-sm ${STYLES[tone]} ${className}`}
    >
      {ICONS[tone]}
      <div>{children}</div>
    </div>
  );
}
