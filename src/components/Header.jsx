function Header({ title, desc, action, back }) {
  return (
    <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
      <div>
        {back && <div className="mb-1 text-sm text-muted">{back}</div>}
        <h1 className="outfit-semibold text-2xl text-ink sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted">{desc}</p>
      </div>
      {action}
    </header>
  );
}

export default Header;
