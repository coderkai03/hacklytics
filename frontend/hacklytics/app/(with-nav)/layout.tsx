import Navigation from "@/components/Navigation";

export default function WithNavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sky-50 text-gray-900">
      <Navigation />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-200/50 via-sky-100/30 to-sky-50 -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c720_1px,transparent_1px),linear-gradient(to_bottom,#0284c720_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
        {children}
      </main>
    </div>
  );
}
