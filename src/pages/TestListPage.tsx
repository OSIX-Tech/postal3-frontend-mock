import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TestCard } from "@/components/tests/TestCard";
import { test_service } from "@/services/test-service";
import type { TestFilters, TestStatus } from "@/types/test";

export function TestListPage() {
  const [filters, set_filters] = useState<TestFilters>({
    search: "",
    status: "all",
    sort_by: "name",
    sort_order: "asc",
  });

  const [show_filters, set_show_filters] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tests", filters],
    queryFn: () => test_service.list_tests(filters),
  });

  const handle_search = (value: string) => {
    set_filters((prev) => ({ ...prev, search: value }));
  };

  const handle_status_change = (value: string) => {
    set_filters((prev) => ({
      ...prev,
      status: value as TestStatus | "all",
    }));
  };

  const handle_sort_change = (value: string) => {
    const [sort_by, sort_order] = value.split("-") as [
      "name" | "question_count",
      "asc" | "desc",
    ];
    set_filters((prev) => ({ ...prev, sort_by, sort_order }));
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Tests Disponibles
        </h1>
        <p className="mt-2 text-muted-foreground">
          Selecciona un test para comenzar tu preparación
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar tests..."
            value={filters.search}
            onChange={(e) => handle_search(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => set_show_filters(!show_filters)}
            className="sm:hidden"
          >
            <Filter className="h-4 w-4" />
          </Button>

          <div className={`${show_filters ? "flex" : "hidden"} sm:flex gap-2`}>
            <Select
              value={filters.status || "all"}
              onValueChange={handle_status_change}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="passed">Aprobados</SelectItem>
                <SelectItem value="failed">Suspendidos</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={`${filters.sort_by}-${filters.sort_order}`}
              onValueChange={handle_sort_change}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Nombre A-Z</SelectItem>
                <SelectItem value="name-desc">Nombre Z-A</SelectItem>
                <SelectItem value="question_count-asc">
                  Menos preguntas
                </SelectItem>
                <SelectItem value="question_count-desc">
                  Más preguntas
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          <span className="ml-3 text-muted-foreground">
            Cargando tests...
          </span>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center py-16">
          <p className="text-red-600 dark:text-red-400">
            Error al cargar los tests: {(error as Error)?.message}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && data?.data.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            No se encontraron tests
          </p>
          {filters.search && (
            <p className="text-muted-foreground mt-2">
              Intenta con otros términos de búsqueda
            </p>
          )}
        </div>
      )}

      {/* Test Grid */}
      {data && data.data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.data.map((test) => (
            <TestCard
              key={test.id}
              id={test.id}
              name={test.name}
              description={test.description}
              image={test.image}
              status={test.status}
              question_count={test.question_count}
              available_time={test.available_time}
              stats={test.stats}
              kind={test.kind}
              training={test.training}
              author={test.author}
            />
          ))}
        </div>
      )}

      {/* Pagination info */}
      {data && data.total > 0 && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Mostrando {data.data.length} de {data.total} tests
        </div>
      )}
    </div>
  );
}
