import Navigation from "@/components/Navigation";

export default function WithNavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />
      <main className="relative pt-24 pb-12">{children}</main>
    </div>
  );
}
