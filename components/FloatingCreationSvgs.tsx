type Props = {
  variant: "unit" | "verse" | "sequence" | "classification" | "picture-match";
};

export function FloatingCreationSvgs({ variant }: Props) {
  return (
    <div className={`floating-creation-svgs floating-${variant}`} aria-hidden="true">
      <svg className="floating-svg floating-star" viewBox="0 0 64 64">
        <path d="M32 4 38 25 59 32 38 39 32 60 26 39 5 32 26 25Z" />
      </svg>
      <svg className="floating-svg floating-leaf" viewBox="0 0 80 80">
        <path d="M67 12C40 14 17 25 14 53c15 14 40 4 53-41Z" />
        <path d="M17 61c12-15 24-25 43-39" />
      </svg>
      <svg className="floating-svg floating-fish-svg" viewBox="0 0 96 64">
        <path d="M68 12 91 4 84 28l7 24-23-9C49 57 24 51 7 32 24 13 49 7 68 21Z" />
        <circle cx="28" cy="27" r="3" />
      </svg>
      <svg className="floating-svg floating-planet" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r="24" />
        <path d="M9 61c13 10 43 7 65-7S97 27 86 22 47 19 24 34 0 55 9 61Z" />
      </svg>
      <svg className="floating-svg floating-bird-svg" viewBox="0 0 96 56">
        <path d="M6 42c15-24 32-27 43-7 9-19 25-17 41 4-17-9-29-6-40 9C38 32 24 31 6 42Z" />
      </svg>
      <svg className="floating-svg floating-wave-svg" viewBox="0 0 120 64">
        <path d="M4 29c15-18 31-18 46 0s31 18 46 0c7-8 13-12 20-12" />
        <path d="M4 48c15-18 31-18 46 0s31 18 46 0c7-8 13-12 20-12" />
      </svg>
      <svg className="floating-svg floating-sprout" viewBox="0 0 80 80">
        <path d="M40 70V37" />
        <path d="M40 39C18 41 11 26 10 12c20 0 33 8 30 27Z" />
        <path d="M41 48c23 1 31-14 30-30-21 0-34 10-30 30Z" />
      </svg>
    </div>
  );
}
