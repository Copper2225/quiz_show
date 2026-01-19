import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Eye } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useState } from "react";

interface Props {
  text: string;
}

const HiddenText = ({ text }: Props) => {
  const [isHeld, setIsHeld] = useState(false);

  const handlePressIn = () => {
    setIsHeld(true);
  };

  const handlePressOut = () => {
    setIsHeld(false);
  };

  return (
    <div className={"flex gap-3 flex-1"}>
      <Label className={"text-nowrap"}>Lösung</Label>
      <Input
        className={"h-full"}
        disabled
        value={isHeld ? text : "**********"}
        readOnly
      />
      <Button
        className={"lg:text-2xl xl:text-3xl h-full"}
        variant={"outline"}
        onMouseDown={handlePressIn}
        onMouseUp={handlePressOut}
        onMouseLeave={handlePressOut}
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
      >
        <Eye />
      </Button>
    </div>
  );
};

export default HiddenText;
