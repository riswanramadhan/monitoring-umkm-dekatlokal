import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex max-w-full min-w-0 flex-col justify-between gap-4 md:flex-row md:items-end",
        className,
      )}
    >
      <div className="max-w-full min-w-0">
        {eyebrow ? (
          <p className="text-sm font-semibold text-[var(--brand-primary)]">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={cn(
            "max-w-full text-2xl font-semibold break-words text-[var(--text-primary)] sm:text-[28px]",
            eyebrow && "mt-1",
          )}
        >
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-3xl text-sm text-[var(--text-secondary)]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div
          className="flex max-w-full min-w-0 flex-wrap items-center gap-2 md:justify-end"
          data-print-hidden="true"
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
}
