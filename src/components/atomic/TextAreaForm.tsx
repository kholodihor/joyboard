import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";

interface InputProps {
  id: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

const TextAreaForm = ({
  id,
  placeholder,
  className,
  defaultValue,
}: InputProps) => {
  console.log(placeholder);
  return (
    <div>
      <div className="space-y-1 w-full">
        <Textarea
          id={id}
          name={id}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={cn(
            " focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-md",
            className
          )}
        />
      </div>
    </div>
  );
};

export default TextAreaForm;
