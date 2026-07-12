import { Search } from 'lucide-react'

export default function SearchBar() {
  const handleSearchClick = () => {
    window.dispatchEvent(new Event('open-command-palette'))
  }

  return (
    <div
      onClick={handleSearchClick}
      className="relative hidden sm:block w-64 cursor-pointer select-none"
      role="search"
      aria-label="Search pages and actions"
    >
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
      <div className="w-full rounded-xl border border-border-subtle bg-bg-secondary py-1.5 pl-10 pr-12 text-xs text-text-tertiary text-left">
        Search pages, actions...
      </div>
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded bg-border-medium px-1.5 py-0.5 text-[9px] font-medium text-text-secondary tracking-widest font-mono">
        ⌘K
      </div>
    </div>
  )
}
