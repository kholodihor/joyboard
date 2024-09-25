import { cn } from "@/lib/utils";

const LargeLoader = ({ className }: { className?: string }) => {
  return (
    <div className="absolute inset-0 w-full h-screen flex justify-center items-center backdrop-blur-sm backdrop-brightness-20 bg-white/70">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="72"
        height="72"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#eab308"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("animate-spin", className)}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
};

export default LargeLoader;
