import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  name: string;
  avatar?: string;
  is_own_profile?: boolean;
  on_edit?: () => void;
  className?: string;
}

function get_initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ProfileAvatar({
  name,
  avatar,
  is_own_profile = false,
  on_edit,
  className,
}: ProfileAvatarProps) {
  return (
    <div className={cn("relative group", className)}>
      <Avatar className="h-28 w-28 text-3xl">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="text-3xl">{get_initials(name)}</AvatarFallback>
      </Avatar>
      {is_own_profile && on_edit && (
        <button
          onClick={on_edit}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="Cambiar avatar"
        >
          <Camera className="h-6 w-6 text-white" />
        </button>
      )}
    </div>
  );
}
