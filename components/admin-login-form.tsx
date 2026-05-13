export function AdminLoginForm() {
  return (
    <section className="content-rail pt-[150px] md:pt-[122px]">
      <div className="mx-auto max-w-md terminal-border p-8">
        <h1 className="font-mono text-2xl font-bold text-shell-text">
          ADMIN_ACCESS
        </h1>
        <p className="mt-3 text-sm leading-6 text-shell-muted">
          Enter the admin password to manage project records.
        </p>
        <form action="/api/admin/login" method="post" className="mt-8 space-y-5">
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-shell-muted">
              Password
            </span>
            <input
              className="mt-2 h-11 w-full border border-white/[0.12] bg-shell-black px-3 font-mono text-sm text-shell-text outline-none focus:border-shell-green"
              name="password"
              type="password"
              required
            />
          </label>
          <button
            className="focus-ring inline-flex h-11 w-full items-center justify-center rounded bg-shell-green px-5 font-mono text-sm font-bold text-shell-black"
            type="submit"
          >
            AUTHENTICATE
          </button>
        </form>
      </div>
    </section>
  );
}
