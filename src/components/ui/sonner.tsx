import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      offset={80}
      duration={2000}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card/90 group-[.toaster]:backdrop-blur-md group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-primary/40 group-[.toaster]:shadow-lg group-[.toaster]:shadow-primary/20 group-[.toaster]:rounded-lg group-[.toaster]:py-2 group-[.toaster]:px-3 group-[.toaster]:text-xs group-[.toaster]:min-h-0 group-[.toaster]:max-w-[280px]",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-[10px]",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:text-[10px] group-[.toast]:rounded-md group-[.toast]:px-2 group-[.toast]:py-1",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:text-[10px] group-[.toast]:rounded-md",
          success: "group-[.toaster]:border-primary/60 group-[.toaster]:bg-primary/10",
          error: "group-[.toaster]:border-destructive/60 group-[.toaster]:bg-destructive/10",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };