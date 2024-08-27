// components\layout\Footer.tsx

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-6 py-8 text-center">
        <p className="text-sm text-muted-foreground font-sans">
          © {new Date().getFullYear()} Nidix. All rights reserved.
        </p>
      </div>
    </footer>
  )
}