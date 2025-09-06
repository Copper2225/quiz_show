import { Button } from "~/components/ui/button";
import { useFetcher } from "react-router";

interface Props {
  data: {
    answers: string[];
    showLetters: "on" | "off";
    trueOrFalse: "on" | "off";
  };
}

const MultipleChoiceField = ({ data }: Props) => {
  const selectionFetcher = useFetcher();

  return (
    <div className={"h-full w-full flex flex-col gap-3"}>
      {data.answers.map((choice, index) => (
        <selectionFetcher.Form
          method={"post"}
          action={"/api/answer"}
          className={"flex-1 flex"}
          key={index}
        >
          <Button
            type={"submit"}
            className={`flex-1 h-full rounded-2xl p-2 ${data.trueOrFalse === "on" && (index % 2 === 0 ? "bg-green-600" : "bg-red-600")}`}
          >
            <input hidden name={"answer"} value={choice} readOnly />
            <div
              className={`flex w-full h-full text-3xl rounded-2xl p-3 border-4 !border-gray-200 ${data.trueOrFalse === "on" && (index % 2 === 0 ? "bg-green-600" : "bg-red-600")}`}
            >
              {data.showLetters === "on" && (
                <div
                  className={
                    "bg-purple-600 px-5 self-center content-center rounded-3xl aspect-square h-min"
                  }
                >
                  {String.fromCharCode("A".charCodeAt(0) + index)}
                </div>
              )}
              <div
                className={
                  "w-full content-center px-5 whitespace-break-spaces overflow-hidden"
                }
              >
                {choice}
              </div>
            </div>
          </Button>
        </selectionFetcher.Form>
      ))}
    </div>
  );
};

export default MultipleChoiceField;
