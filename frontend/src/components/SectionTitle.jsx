export const SectionTitle = ({ eyebrow, title, description }) => (
  <div className="max-w-2xl">
    {eyebrow && (
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
        {eyebrow}
      </p>
    )}
    <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h2>
    {description && <p className="mt-4 text-slate-600">{description}</p>}
  </div>
);
