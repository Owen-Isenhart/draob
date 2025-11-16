import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="man border-b border-dashed w-full flex flex-row items-center justify-between px-4 py-2">
      <div className="flex items-center gap-5">
        <Link
  href="/"
  // The 'group' class on the parent is still correct
  className="group text-xl font-bold man"
>
  draob
  <span
    className="
      text-amber-700 text-3xl
      inline-block
      pulse-dot
    "
  >
    .
  </span>
</Link>
        {/* conditionally render hamburger menu if logged in, or just always render it but if they interact with it and not logged in redirect them */}
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="border border-transparent py-1 px-2 text-black rounded-md hover:border-amber-700 transition-all duration-300"
        >
          login
        </Link>
        <Link
          href="/register"
          className="bg-amber-700 py-1 px-2 border border-amber-700 text-white rounded-md hover:bg-white hover:border-amber-700 hover:text-black transition-all duration-300"
        >
          register
        </Link>
      </div>
    </nav>
  );
}
