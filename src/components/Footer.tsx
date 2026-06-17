export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="container-wide text-center text-sm text-muted sm:text-left">
        <p>&copy; {new Date().getFullYear()} Bo Hubbard.</p>
      </div>
    </footer>
  );
}
