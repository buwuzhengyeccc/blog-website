export type ContentCard = {
  title: string;
  body: string;
};

export function ContentCardGrid({ cards }: { cards: ContentCard[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {cards.map((card) => (
        <section key={card.title} className="surface rounded-3xl p-8">
          <h2 className="text-2xl font-semibold">{card.title}</h2>
          <p className="mt-4 text-sm leading-7 text-stone-300 light:text-stone-700">{card.body}</p>
        </section>
      ))}
    </div>
  );
}
