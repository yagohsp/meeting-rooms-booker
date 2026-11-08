import Form from "next/form";
import Link from "next/link";
import { cn } from "cn";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RoomFilters } from "@/features/rooms/filters";

type Props = {
  filters: RoomFilters;
  resources: { id: string; name: string }[];
};

export function RoomFiltersForm({ filters, resources }: Props) {
  return (
    <Form
      action="/salas"
      noValidate
      key={JSON.stringify(filters)}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="capacidade">Capacidade mínima</Label>
        <Input
          id="capacidade"
          name="capacidade"
          type="number"
          min={1}
          inputMode="numeric"
          placeholder="Qualquer"
          defaultValue={filters.minCapacity ?? ""}
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">Recursos</legend>
        {resources.map((resource) => (
          <label key={resource.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="recurso"
              value={resource.name}
              defaultChecked={filters.resources.includes(resource.name)}
              className="size-4 accent-primary"
            />
            {resource.name}
          </label>
        ))}
      </fieldset>

      <div className="flex gap-2">
        <Button type="submit">Filtrar</Button>
        <Link
          href="/salas"
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          Limpar
        </Link>
      </div>
    </Form>
  );
}
