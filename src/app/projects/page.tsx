export default function Projects() {
  const projects = [
    {
      title: "Chicago Streets",
      date: "2024 - Present",
      description: "Ongoing documentation of Chicago's urban landscape and human stories",
      url: "https://jackjross.com/",
    },
    {
      title: "Vietnam 2025",
      date: "2025",
      description: "Returning to Vietnam for new perspectives and stories",
      url: "https://jackjross.com/vietnam-2025",
    },
    {
      title: "Vietnam 2018-2023",
      date: "2018 - 2023",
      description: "Five years of cultural documentation and street photography",
      url: "https://jackjross.com/vietnam2018-2023",
    },
  ];

  return (
    <div className="min-h-screen px-[70px] md:px-[70px] px-6 py-24 md:py-24 py-16 max-w-[900px] mx-auto">
      <h2 className="text-[26px] md:text-[26px] text-[20px] font-light tracking-tight mb-10 md:mb-10 mb-8">Projects</h2>
      <ul className="space-y-12">
        {projects.map((project) => (
          <li key={project.title} className="pb-12 border-b border-current/10 last:border-0">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group hover:opacity-60 transition-opacity"
            >
              <div className="flex justify-between items-baseline mb-4">
                <h3 className="text-[18px] font-light">{project.title}</h3>
                <span className="text-[10px] font-light opacity-50">{project.date}</span>
              </div>
              <p className="text-[12px] font-light leading-relaxed opacity-70">
                {project.description}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
