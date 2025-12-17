export default function Contact() {
  const contacts = [
    { label: "jackj.ross@gmail.com", href: "mailto:jackj.ross@gmail.com" },
    { label: "Instagram ↗", href: "https://instagram.com/jackjross" },
    { label: "GitHub ↗", href: "https://github.com/jackyjross" },
    { label: "LinkedIn ↗", href: "https://linkedin.com/in/jackjross" },
    { label: "Substack ↗", href: "https://jackjross.substack.com" },
  ];

  return (
    <div className="min-h-screen px-[70px] py-24 max-w-[900px] mx-auto">
      <h2 className="text-[32px] font-light tracking-tight mb-10">Contact</h2>
      <ul className="flex flex-col gap-5">
        {contacts.map((contact) => (
          <li key={contact.label}>
            <a
              href={contact.href}
              target={contact.href.startsWith('http') ? '_blank' : undefined}
              rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-lg font-light hover:opacity-60 transition-opacity inline-block"
            >
              {contact.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
