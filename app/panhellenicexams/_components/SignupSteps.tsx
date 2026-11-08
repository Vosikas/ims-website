import { el } from "../_lib/i18n/el";

/** The progress bar of the signup: which of the three steps the user is on. */
export function SignupSteps({ current }: { current: number }) {
  return (
    <ol aria-label={el.signup.stepsLabel} className="mt-6 flex gap-2">
      {el.signup.steps.map((label, index) => (
        <li key={label} aria-current={index === current ? "step" : undefined} className="flex-1">
          <span className={`block h-1 rounded-full ${index <= current ? "bg-gold" : "bg-line"}`} />
          <span
            className={`mt-1.5 block text-xs ${index === current ? "font-semibold text-navy" : "text-ink-muted"}`}
          >
            {index + 1}. {label}
          </span>
        </li>
      ))}
    </ol>
  );
}
