type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: string;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  icon,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`mb-8 sm:mb-10 ${className}`}>
      {icon ? (
        <div className="flex flex-wrap items-start gap-3 sm:gap-4">
          <span className="text-4xl sm:text-5xl">{icon}</span>
          <div className="min-w-0 flex-1">
            <HeaderText eyebrow={eyebrow} title={title} description={description} />
          </div>
        </div>
      ) : (
        <HeaderText eyebrow={eyebrow} title={title} description={description} />
      )}
    </div>
  );
}

function HeaderText({
  eyebrow,
  title,
  description,
}: Pick<PageHeaderProps, "eyebrow" | "title" | "description">) {
  return (
    <>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-green-500">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-2xl font-bold text-green-50 sm:text-3xl md:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-xl text-sm text-green-300/60 sm:mt-3 sm:text-base">
          {description}
        </p>
      )}
    </>
  );
}
