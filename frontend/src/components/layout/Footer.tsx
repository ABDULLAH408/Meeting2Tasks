export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Meeting<span className="text-blue-600">2</span>Tasks
          </span>
          <span className="text-gray-400">|</span>
          <span className="text-sm text-gray-500">Transforming meetings into action.</span>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <a href="https://github.com/meeting2tasks" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
            GitHub
          </a>
          <span>&copy; {new Date().getFullYear()} Meeting2Tasks</span>
        </div>
      </div>
    </footer>
  );
}
