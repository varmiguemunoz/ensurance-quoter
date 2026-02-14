interface PaymentFooterProps {
  links?: { label: string; href?: string }[];
}

function PaymentFooter({ links }: PaymentFooterProps) {
  const defaultLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Support", href: "#" },
  ];

  const footerLinks = links ?? defaultLinks;

  return (
    <footer className="border-t border-slate-200 py-8 flex flex-col items-center gap-2">
      <p className="text-xs text-slate-400 text-center">
        © 2024 My Insurance Quoter. All rights reserved.
      </p>
      <div className="flex items-center gap-4">
        {footerLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-xs text-slate-400 hover:text-slate-500 text-center transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}

export { PaymentFooter };
