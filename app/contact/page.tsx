import { ContactIntroPage } from "@/components/contact/ContactIntroPage";
import { getContactPageContent } from "@/lib/pages";

export default function ContactPage() {
  const content = getContactPageContent();

  return <ContactIntroPage content={content} />;
}
