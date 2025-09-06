import { Button } from "~/components/ui/button";

const MultipleChoiceBaseShow = () => {
  const data = {
    answers: ["lol", "test"],
    trueOrFalse: "off",
    showLetters: "off",
  };

  return (
    <div className={"flex flex-1 p-4 gap-4"}>
      <div
        className={
          "w-3/5 content-center bg-primary h-full p-5 rounded-3xl outline-gray-200 outline-4 -outline-offset-12"
        }
      >
        <img
          src={
            "https://images.photowall.com/products/60869/azores-mountain-landscape-1.jpg?h=699&q=85"
          }
        />
      </div>
      <div className={"w-full flex flex-1 flex-col gap-4"}>
        {data.answers.map((choice, index) => (
          <Button
            type={"submit"}
            className={`flex w-full flex-1 text-5xl rounded-2xl p-3 outline-4 outline-solid -outline-offset-12 outline-gray-200 ${data.trueOrFalse === "on" && (index % 2 === 0 ? "bg-green-600" : "bg-red-600")}`}
          >
            <input hidden name={"answer"} value={choice} readOnly />
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
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceBaseShow;
