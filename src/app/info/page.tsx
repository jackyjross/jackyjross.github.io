export default function Info() {
  return (
    <div className="min-h-screen px-[70px] py-24 max-w-[900px] mx-auto">
      <h2 className="text-[26px] font-light tracking-tight mb-10">Info</h2>
      <div className="space-y-6">
        <p className="text-[13px] leading-relaxed font-light">
          I'm a photographer and growth professional based in Chicago. I blend street photography
          with business development, currently serving as Associate Director of Growth at CPGIO.
        </p>

        <p className="text-[13px] leading-relaxed font-light">
          My photography journey began in Vietnam, where I spent five years (2018-2023) documenting
          urban life and culture. Now in Chicago, I continue capturing the interplay between
          architecture and human moments across diverse neighborhoods.
        </p>

        <h3 className="text-[16px] font-light mt-10 mb-5">Tools</h3>
        <ul className="space-y-2.5">
          <li className="pl-5 relative before:content-['→'] before:absolute before:left-0 before:opacity-50 font-light text-[13px]">
            Fujifilm X-Pro3 + XF 23mm F2
          </li>
          <li className="pl-5 relative before:content-['→'] before:absolute before:left-0 before:opacity-50 font-light text-[13px]">
            Lightroom, Capture One
          </li>
          <li className="pl-5 relative before:content-['→'] before:absolute before:left-0 before:opacity-50 font-light text-[13px]">
            Claude Code, Cursor, Replit
          </li>
        </ul>
      </div>
    </div>
  );
}
