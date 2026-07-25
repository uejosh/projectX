type Props = { variant: "verse" | "sequence" | "classification" | "picture-match" };

export function CreationBackdrop({ variant }: Props) {
  return (
    <div className={`creation-backdrop creation-${variant}`} aria-hidden="true">
      <span className="creation-sun" />
      <span className="creation-stars star-cluster-one">✦ · ✧</span>
      <span className="creation-stars star-cluster-two">· ✦</span>
      <span className="creation-cloud cloud-one" />
      <span className="creation-cloud cloud-two" />
      <span className="creation-hills" />
      <span className="creation-tree tree-one"><i /><b /></span>
      <span className="creation-tree tree-two"><i /><b /></span>
      <span className="creation-bird bird-one">⌁</span>
      <span className="creation-bird bird-two">⌁</span>
      <span className="creation-waves" />
      <span className="creation-fish fish-one">◁</span>
      <span className="creation-fish fish-two">◁</span>
    </div>
  );
}
