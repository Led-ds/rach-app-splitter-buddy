
interface MainContentProps {
  children: React.ReactNode;
}

export const MainContent = ({ children }: MainContentProps) => {
  return (
    <main className="flex-1 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {children}
      </div>
    </main>
  );
};
