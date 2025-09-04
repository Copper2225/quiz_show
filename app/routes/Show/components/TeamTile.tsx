interface Props {
  name: string;
  points: number;
}

const TeamTile = ({ name, points }: Props) => {
  return (
    <div
      className={
        "self-end p-5 text-3xl text-center flex-1 flex flex-col bg-purple-600 rounded-t-2xl"
      }
    >
      <span>{name}</span>
      <span className={"text-2xl"}>{points}</span>
    </div>
  );
};

export default TeamTile;
