const GITHUB_URL = 'https://github.com/SaladinSoftware'

// Heroicons ships no brand marks, so the GitHub logo is inlined here.
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

export default function About() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
        About Us
      </h1>

      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-900/10 bg-gray-100 px-4 py-8 text-center sm:flex-row dark:border-white/10 dark:bg-white/5">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Made by Saladin Software, Mohamad Ziad Alkabakibi
        </p>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Saladin Software on GitHub"
          className="rounded-full p-1.5 text-gray-700 transition hover:bg-gray-900/5 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <GithubIcon className="size-8" />
        </a>
      </div>
    </main>
  )
}
