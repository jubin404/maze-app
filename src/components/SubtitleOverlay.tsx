export default function SubtitleOverlay({ subtitle }: { subtitle: string }) {
    return subtitle ? <div className="subtitle">{subtitle}</div> : null;
  }