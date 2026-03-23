import { AboutIntroPage } from "@/components/about/AboutIntroPage";
import { getAboutPageContent } from "@/lib/pages";

export default function AboutPage() {
  const content = getAboutPageContent();

  return <AboutIntroPage content={content} />;
}
