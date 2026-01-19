interface Props {
  teamAnswers: Map<string, { answer: string; time: Date }>;
}

export const TeamSetLives: React.FC<Props> = ({teamAnswers}) => {
  return (
    <>{Array.from(teamAnswers.entries()).map(([name, answer]) => <span>{name}: {answer.answer}</span>)
}</>)};