import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      duration={2000}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background/95 group-[.toaster]:backdrop-blur-sm group-[.toaster]:text-foreground group-[.toaster]:border-primary/30 group-[.toaster]:shadow-lg group-[.toaster]:shadow-primary/10 group-[.toaster]:rounded-xl group-[.toaster]:py-2 group-[.toaster]:px-4 group-[.toaster]:text-sm",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-xs",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:text-xs group-[.toast]:rounded-lg",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:text-xs group-[.toast]:rounded-lg",
          success: "group-[.toaster]:border-green-500/50 group-[.toaster]:bg-green-500/10",
          error: "group-[.toaster]:border-red-500/50 group-[.toaster]:bg-red-500/10",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };