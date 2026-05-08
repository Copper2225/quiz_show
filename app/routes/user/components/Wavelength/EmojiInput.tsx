import { Suspense, useEffect, useState, lazy, useMemo } from "react";
import {
  type EmojiClickData,
  EmojiStyle,
  SuggestionMode,
  Theme,
} from "emoji-picker-react";

const EmojiPicker = lazy(() => import("emoji-picker-react"));

export const EmojiInput = () => {
  const [emojis, setEmojis] = useState<EmojiClickData[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [emojiData, setEmojiData] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    import("emoji-picker-react/dist/data/emojis-de").then((module) => {
      setEmojiData(module.default);
    });
  }, []);

  const handleEmojiClick = (emoji: EmojiClickData) => {
    if (emojis.length <= 10) {
      setEmojis([...emojis, emoji]);
    }
  };

  const handleRemoveEmoji = (index: number) => {
    setEmojis((prevState) => prevState.filter((_, i) => i !== index));
  };

  const formatEmojis = useMemo(() => {
    return emojis.map((e) => e.emoji).join("");
  }, [emojis]);

  const formatValue = useMemo(() => {
    return JSON.stringify(
      emojis.map((e) => ({
        url: e.imageUrl,
      })),
    );
  }, [emojis]);

  if (!isClient || !emojiData) {
    return (
      <div className="h-[450px] w-full bg-gray-100 animate-pulse flex items-center justify-center rounded-lg">
        <span className="text-gray-400">Loading Emoji Picker...</span>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="h-[450px] w-full animate-pulse flex items-center justify-center rounded-lg">
          <span className="text-gray-400">Loading Emoji Picker...</span>
        </div>
      }
    >
      <div className={"flex justify-center w-full mb-2"}>
        {emojis.map((e, index) => (
          <img
            key={index}
            className={"h-[40px] aspect-square cursor-pointer"}
            src={e.imageUrl}
            alt={e.emoji}
            onClick={() => handleRemoveEmoji(index)}
          />
        ))}
      </div>
      <input name={"hint"} className={"hidden"} readOnly value={formatEmojis} />
      <input
        name={"emojis"}
        className={"hidden"}
        readOnly
        value={formatValue}
      />
      <EmojiPicker
        width={"100%"}
        className={"mb-2"}
        emojiData={emojiData}
        suggestedEmojisMode={SuggestionMode.RECENT}
        theme={Theme.AUTO}
        emojiStyle={EmojiStyle.APPLE}
        onEmojiClick={handleEmojiClick}
      />
    </Suspense>
  );
};
