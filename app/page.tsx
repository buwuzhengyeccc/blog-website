import { HomeCubeGallery, type GalleryItem } from "@/components/home/HomeCubeGallery";
import { getHomePageContent } from "@/lib/pages";

export default function HomePage() {
  const content = getHomePageContent();
  const items: GalleryItem[] = content.items.map((item) => ({
    ...item,
    title: (
      <>
        {item.id === "s0" ? <br /> : null}
        {item.titleLines.map((line, index) => (
          <span key={`${item.id}-${line}-${index}`}>
            {index > 0 ? <br /> : null}
            {line}
          </span>
        ))}
      </>
    )
  }));

  return <HomeCubeGallery items={items} />;
}
