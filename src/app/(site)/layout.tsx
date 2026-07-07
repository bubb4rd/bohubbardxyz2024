import { MobileNav } from "@/components/MobileNav";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MobileNav />
      {children}
    </>
  );
}
