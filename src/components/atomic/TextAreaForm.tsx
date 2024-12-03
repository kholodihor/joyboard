import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

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
  return (
    <div>
      <div className="w-full space-y-1">
        <Textarea
          id={id}
          name={id}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={cn(
            "shadow-md outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
            className
          )}
        />
      </div>
    </div>
  );
};

export default TextAreaForm;
