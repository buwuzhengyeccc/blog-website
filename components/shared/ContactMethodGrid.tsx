export type ContactMethod = {
  label: string;
  value: string;
  description: string;
};

export function ContactMethodGrid({ methods }: { methods: ContactMethod[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {methods.map((method) => (
        <div key={method.label} className="surface rounded-3xl p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">{method.label}</p>
          <p className="mt-4 text-xl font-semibold">{method.value}</p>
          <p className="mt-3 text-sm leading-7 text-stone-300 light:text-stone-700">{method.description}</p>
        </div>
      ))}
    </div>
  );
}
