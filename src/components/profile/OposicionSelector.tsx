import { useState } from "react";
import { Plus, Star, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Oposicion } from "@/types/profile";

interface OposicionSelectorProps {
  oposiciones: Oposicion[];
  active_oposicion?: Oposicion;
  available_oposiciones: Oposicion[];
  on_set_active: (id: string) => Promise<unknown>;
  on_add: (id: string) => Promise<unknown>;
  on_remove: (id: string) => Promise<unknown>;
  on_fetch_available: () => void;
  is_loading?: boolean;
}

export function OposicionSelector({
  oposiciones,
  active_oposicion,
  available_oposiciones,
  on_set_active,
  on_add,
  on_remove,
  on_fetch_available,
  is_loading = false,
}: OposicionSelectorProps) {
  const [selected_new, set_selected_new] = useState<string>("");

  const addable = available_oposiciones.filter(
    (ao) => !oposiciones.find((o) => o.id === ao.id)
  );

  const handle_add = async () => {
    if (!selected_new) return;
    await on_add(selected_new);
    set_selected_new("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Mis oposiciones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {oposiciones.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No tienes oposiciones configuradas.
          </p>
        ) : (
          <ul className="space-y-2">
            {oposiciones.map((opo) => (
              <li
                key={opo.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-2">
                  <span>{opo.icon}</span>
                  <span className="text-sm font-medium">{opo.name}</span>
                  {active_oposicion?.id === opo.id && (
                    <Badge variant="secondary" className="text-xs">
                      Activa
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {active_oposicion?.id !== opo.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => on_set_active(opo.id)}
                      disabled={is_loading}
                      title="Establecer como activa"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => on_remove(opo.id)}
                    disabled={is_loading}
                    className="text-destructive hover:text-destructive"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-end gap-2 pt-2 border-t">
          <div className="flex-1">
            <Select
              value={selected_new}
              onValueChange={set_selected_new}
              onOpenChange={(open) => {
                if (open) on_fetch_available();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Añadir oposición..." />
              </SelectTrigger>
              <SelectContent>
                {addable.map((opo) => (
                  <SelectItem key={opo.id} value={opo.id}>
                    {opo.icon} {opo.name}
                  </SelectItem>
                ))}
                {addable.length === 0 && (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    No hay más oposiciones disponibles
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handle_add}
            disabled={!selected_new || is_loading}
            size="sm"
          >
            {is_loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Añadir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
