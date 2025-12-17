'use client';

import { useState } from 'react';

export default function Contact() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const professionalContacts = [
    {
      label: "Email",
      value: "me@jackjross.com",
      href: "mailto:me@jackjross.com",
      description: "Best for professional inquiries and collaborations"
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/jackjross",
      href: "https://linkedin.com/in/jackjross",
      description: "Connect professionally and view my work experience"
    },
  ];

  const creativeContacts = [
    {
      label: "Instagram",
      value: "@jackjross",
      href: "https://instagram.com/jackjross",
      description: "Follow my street photography journey"
    },
    {
      label: "GitHub",
      value: "github.com/jackyjross",
      href: "https://github.com/jackyjross",
      description: "Explore my code and development projects"
    },
    {
      label: "Substack",
      value: "jackjross.substack.com",
      href: "https://jackjross.substack.com",
      description: "Read my thoughts on photography and growth"
    },
  ];

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText('me@jackjross.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="min-h-screen px-[70px] py-24 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="mb-16">
        <h2 className="text-[38px] font-light tracking-tight mb-6">Let's Connect</h2>
        <p className="text-[16px] font-light leading-relaxed opacity-70 max-w-[700px]">
          I'm always open to discussing photography projects, personal and professional growth opportunities,
          or just having a conversation. Topic? Up to you!
        </p>
      </div>

      {/* Professional Section */}
      <section className="mb-16">
        <h3 className="text-[19px] font-light tracking-tight mb-6 opacity-50">Professional</h3>
        <div className="space-y-4">
          {professionalContacts.map((contact) => (
            <div
              key={contact.label}
              className="group relative border border-current/10 p-6 hover:border-current/30 transition-all duration-300 hover:translate-x-1"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[11px] font-light opacity-50 uppercase tracking-wider">
                      {contact.label}
                    </span>
                    {contact.label === "Email" && (
                      <button
                        onClick={handleCopyEmail}
                        className="text-[10px] px-2 py-1 border border-current/20 hover:border-current/50 transition-all"
                      >
                        {copiedEmail ? "Copied!" : "Copy"}
                      </button>
                    )}
                  </div>
                  <a
                    href={contact.href}
                    target={contact.href.startsWith('http') ? '_blank' : undefined}
                    rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-[19px] font-light hover:opacity-60 transition-opacity inline-block mb-2"
                  >
                    {contact.value}
                  </a>
                  <p className="text-[11px] font-light opacity-60">
                    {contact.description}
                  </p>
                </div>
                <div className="text-[19px] opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Creative & Social Section */}
      <section>
        <h3 className="text-[19px] font-light tracking-tight mb-6 opacity-50">Creative & Social</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {creativeContacts.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-current/10 p-6 hover:border-current/30 transition-all duration-300 hover:-translate-y-1 block"
            >
              <div className="mb-3">
                <span className="text-[10px] font-light opacity-50 uppercase tracking-wider">
                  {contact.label}
                </span>
              </div>
              <div className="text-[14px] font-light mb-3 group-hover:opacity-60 transition-opacity">
                {contact.value}
              </div>
              <p className="text-[10px] font-light opacity-60 leading-relaxed">
                {contact.description}
              </p>
              <div className="mt-4 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">
                Visit →
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Response Time Note */}
      <div className="mt-16 p-6 border border-current/10">
        <p className="text-[11px] font-light opacity-60 leading-relaxed">
          <span className="opacity-100 font-normal">Response time:</span> I typically respond to emails
          within 24-48 hours. For urgent matters, please mention "urgent" in the subject line.
        </p>
      </div>
    </div>
  );
}
