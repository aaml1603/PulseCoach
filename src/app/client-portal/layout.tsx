// This layout doesn't require authentication
export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4 flex items-center">
          <div className="h-10 w-10 relative mr-3">
            <img
              src="https://i.imgur.com/xFQGdgC.png"
              alt="FitCoach Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="text-xl font-bold">PulseCoach</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>

      <footer className="bg-card border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} PulseCoach. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
