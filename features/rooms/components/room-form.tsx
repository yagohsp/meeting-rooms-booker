"use client";

import Link from "next/link";
import { cn } from "cn";
import { useActionState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SaveRoomState } from "../actions";
import { MAX_CAPACITY, MAX_NAME_LENGTH } from "../limits";
import type { RoomInput } from "../schemas";

type Props = {
  action: (state: SaveRoomState, formData: FormData) => Promise<SaveRoomState>;
  resources: { id: string; name: string }[];
  initialValues?: RoomInput;
};

const initialState: SaveRoomState = { status: "idle" };

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-sm text-destructive">{messages[0]}</p>;
}

export function RoomForm({ action, resources, initialValues }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const values = state.status === "error" ? state.values : initialValues;
  const errors = state.status === "error" ? state.errors : {};

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {errors.form && (
        <ul
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {errors.form.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          required
          maxLength={MAX_NAME_LENGTH}
          defaultValue={values?.name}
          aria-invalid={!!errors.name}
        />
        <FieldError messages={errors.name} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="capacity">Capacidade (pessoas)</Label>
        <Input
          id="capacity"
          name="capacity"
          type="number"
          required
          min={1}
          max={MAX_CAPACITY}
          inputMode="numeric"
          defaultValue={values?.capacity}
          aria-invalid={!!errors.capacity}
        />
        <FieldError messages={errors.capacity} />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">Recursos</legend>
        {resources.map((resource) => (
          <label key={resource.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="resourceIds"
              value={resource.id}
              defaultChecked={values?.resourceIds.includes(resource.id)}
              className="size-4 accent-primary"
            />
            {resource.name}
          </label>
        ))}
      </fieldset>

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Salvar"}
        </Button>
        <Link
          href="/admin/salas"
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
