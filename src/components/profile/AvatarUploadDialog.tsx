import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarUploadDialogProps {
  open: boolean;
  on_open_change: (open: boolean) => void;
  current_avatar?: string;
  name: string;
  on_upload: (file: File) => Promise<void>;
  is_uploading?: boolean;
}

function get_initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AvatarUploadDialog({
  open,
  on_open_change,
  current_avatar,
  name,
  on_upload,
  is_uploading = false,
}: AvatarUploadDialogProps) {
  const [preview, set_preview] = useState<string | null>(null);
  const [selected_file, set_selected_file] = useState<File | null>(null);
  const input_ref = useRef<HTMLInputElement>(null);

  const handle_file_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    set_selected_file(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      set_preview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handle_upload = async () => {
    if (!selected_file) return;
    await on_upload(selected_file);
    set_preview(null);
    set_selected_file(null);
    on_open_change(false);
  };

  const handle_close = (value: boolean) => {
    if (!value) {
      set_preview(null);
      set_selected_file(null);
    }
    on_open_change(value);
  };

  return (
    <Dialog open={open} onOpenChange={handle_close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar avatar</DialogTitle>
          <DialogDescription>
            Sube una imagen para tu perfil. Se recomienda una imagen cuadrada.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-32 w-32 text-4xl">
            <AvatarImage src={preview ?? current_avatar} alt={name} />
            <AvatarFallback className="text-4xl">
              {get_initials(name)}
            </AvatarFallback>
          </Avatar>

          <input
            ref={input_ref}
            type="file"
            accept="image/*"
            onChange={handle_file_change}
            className="hidden"
          />

          <Button
            variant="outline"
            onClick={() => input_ref.current?.click()}
            disabled={is_uploading}
          >
            <Upload className="h-4 w-4" />
            Seleccionar imagen
          </Button>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handle_close(false)}
            disabled={is_uploading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handle_upload}
            disabled={!selected_file || is_uploading}
          >
            {is_uploading && <Loader2 className="h-4 w-4 animate-spin" />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
