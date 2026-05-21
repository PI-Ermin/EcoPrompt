const extensionUrl = "/api/prompts";

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-white/15 bg-[#030914]/75 px-4 backdrop-blur md:px-8">
      <div className="text-lg font-black tracking-normal text-white">
        EcoPrompt <span className="text-[#20e3b2]">Brasil</span>
      </div>
      <a
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-br from-[#20e3b2] to-[#3aa7ff] px-4 text-sm font-extrabold text-[#03131f] shadow-[0_14px_40px_rgba(32,227,178,0.22)] md:px-5"
        href={extensionUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Endpoint da API
      </a>
    </header>
  );
}

export { extensionUrl };
