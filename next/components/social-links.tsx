import { Twitch, Github, Send } from "lucide-react";

const socialLinks = [
  {
    href: "https://www.twitch.tv/olesha",
    icon: Twitch,
    label: "olesha",
    mobileLabel: "twitch",
    bgColor: "bg-purple-500",
    hoverColor: "hover:bg-purple-400",
  },
  {
    href: "https://github.com/catlilface/bebebendle",
    icon: Github,
    label: "github",
    mobileLabel: "git",
    bgColor: "bg-gray-700",
    hoverColor: "hover:bg-gray-600",
  },
  {
    href: "https://t.me/bebebendle_bot",
    icon: Send,
    label: "Предложить свой слоп",
    mobileLabel: "слоп",
    bgColor: "bg-blue-500",
    hoverColor: "hover:bg-blue-400",
  },
];

export function SocialLinks() {
  return (
    <div className="fixed bottom-2 sm:bottom-4 right-2 sm:right-4 2xl:bottom-8 2xl:right-8 4xl:bottom-12 4xl:right-12 z-20 flex flex-col gap-2 sm:gap-3 2xl:gap-4 4xl:gap-5 items-end">
      {socialLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`pixel-btn inline-flex items-center gap-1.5 sm:gap-2 2xl:gap-3 4xl:gap-4 ${link.bgColor} border-2 sm:border-4 border-black px-2 sm:px-4 py-1.5 sm:py-2 2xl:px-6 2xl:py-3 4xl:px-8 4xl:py-4 text-white text-xs sm:text-sm md:text-base 2xl:text-xl 4xl:text-2xl ${link.hoverColor} w-fit`}
        >
          <link.icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 2xl:w-7 2xl:h-7 4xl:w-9 4xl:h-9" />
          <span className="hidden sm:inline">{link.label}</span>
          <span className="sm:hidden">{link.mobileLabel}</span>
        </a>
      ))}
    </div>
  );
}
