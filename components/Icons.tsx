import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function IconBase({ size = 20, children, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export const BookIcon = (props: IconProps) => <IconBase {...props}><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z"/><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22V5.5Z"/></IconBase>;
export const ArrowIcon = (props: IconProps) => <IconBase {...props}><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></IconBase>;
export const BackIcon = (props: IconProps) => <IconBase {...props}><path d="M19 12H5"/><path d="m10 17-5-5 5-5"/></IconBase>;
export const PlayIcon = (props: IconProps) => <IconBase {...props}><path d="m8 5 11 7-11 7V5Z"/></IconBase>;
export const PauseIcon = (props: IconProps) => <IconBase {...props}><path d="M8 5v14M16 5v14"/></IconBase>;
export const VolumeIcon = (props: IconProps) => <IconBase {...props}><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 9a4 4 0 0 1 0 6"/><path d="M18 6a8 8 0 0 1 0 12"/></IconBase>;
export const VolumeOffIcon = (props: IconProps) => <IconBase {...props}><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="m16 10 5 5M21 10l-5 5"/></IconBase>;
export const HeadphonesIcon = (props: IconProps) => <IconBase {...props}><path d="M4 14a8 8 0 0 1 16 0"/><path d="M4 14v5a2 2 0 0 0 2 2h2v-8H6a2 2 0 0 0-2 2Z"/><path d="M20 14v5a2 2 0 0 1-2 2h-2v-8h2a2 2 0 0 1 2 2Z"/></IconBase>;
export const PuzzleIcon = (props: IconProps) => <IconBase {...props}><path d="M8.5 3H4a1 1 0 0 0-1 1v4.5a2.5 2.5 0 1 1 0 5V20a1 1 0 0 0 1 1h4.5a2.5 2.5 0 1 1 5 0H20a1 1 0 0 0 1-1v-6.5a2.5 2.5 0 1 0 0-5V4a1 1 0 0 0-1-1h-6.5a2.5 2.5 0 1 0-5 0Z"/></IconBase>;
export const LayersIcon = (props: IconProps) => <IconBase {...props}><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></IconBase>;
export const LockIcon = (props: IconProps) => <IconBase {...props}><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></IconBase>;
export const CheckIcon = (props: IconProps) => <IconBase {...props}><path d="m5 12 4 4L19 6"/></IconBase>;
export const GemIcon = (props: IconProps) => <IconBase {...props}><path d="m12 22 9-11-4-7H7l-4 7 9 11Z"/><path d="M3 11h18M7 4l5 18 5-18M8.5 11 12 4l3.5 7"/></IconBase>;
export const CoinIcon = (props: IconProps) => <IconBase {...props}><circle cx="12" cy="12" r="9"/><path d="M14.8 8.8c-.6-.7-1.5-1.1-2.8-1.1-1.7 0-2.8.8-2.8 2 0 3.1 5.7 1.4 5.7 4.5 0 1.2-1.1 2.1-2.9 2.1-1.4 0-2.5-.5-3.1-1.3M12 6.2v11.6"/></IconBase>;
export const SparkleIcon = (props: IconProps) => <IconBase {...props}><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></IconBase>;
export const RotateIcon = (props: IconProps) => <IconBase {...props}><path d="M20 7v5h-5"/><path d="M19 12a8 8 0 1 1-2.3-5.7L20 9"/></IconBase>;
export const UpIcon = (props: IconProps) => <IconBase {...props}><path d="m6 15 6-6 6 6"/></IconBase>;
export const DownIcon = (props: IconProps) => <IconBase {...props}><path d="m6 9 6 6 6-6"/></IconBase>;
export const MessageIcon = (props: IconProps) => <IconBase {...props}><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/></IconBase>;
