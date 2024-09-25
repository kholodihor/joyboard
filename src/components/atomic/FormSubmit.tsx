import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type Variant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | null
  | undefined;

interface SubmitProps {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
}

const FormSubmit = ({ children, className, variant }: SubmitProps) => {
  return (
    <Button className={cn(className)} variant={variant} type="submit" size="sm">
      {children}
    </Button>
  );
};

export default FormSubmit;
