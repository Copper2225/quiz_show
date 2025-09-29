interface Props {
  name: string;
  points: number;
  answer?: string;
  showAnswer: boolean;
  highlighted?: boolean;
  color?: string;
}

const TeamTile = ({
  name,
  points,
  showAnswer,
  answer,
  highlighted = false,
  color,
}: Props) => {
  return (
    <div
      className={`self-end p-5 text-3xl text-center flex-1 flex flex-col rounded-t-2xl ${
        highlighted ? "bg-orange-500" : "bg-purple-700"
      }`}
      style={{
        background: color !== undefined ? color : undefined,
      }}
    >
      {answer && showAnswer && (
        <div className={"mb-2 p-2 bg-white/20 rounded text-2xl"}>{answer}</div>
      )}
      <span>{name}</span>
      <span className={"text-2xl"}>{points}</span>
    </div>
  );
};

export default TeamTile;
