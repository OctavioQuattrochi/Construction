import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { getMemberSession } from "@/lib/member-auth";

export const dynamic = "force-dynamic";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const member = await getMemberSession();
  return (
    <>
      <ScrollProgress />
      <Navbar
        member={
          member
            ? { name: member.name, email: member.email, image: member.image }
            : null
        }
      />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
