"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { createBooking, type CreateBookingState } from "../actions";

type Props = {
  rooms: { id: string; name: string; capacity: number }[];
  defaultRoomId?: string;
  today: string;
};

const initialState: CreateBookingState = { status: "idle" };

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-sm text-destructive">{messages[0]}</p>;
}

export function BookingForm({ rooms, defaultRoomId, today }: Props) {
  const [state, action, pending] = useActionState(createBooking, initialState);
  const values = state.status === "error" ? state.values : undefined;
  const errors = state.status === "error" ? state.errors : {};

  return (
    <form action={action} className="flex flex-col gap-5">
      {state.status === "success" && (
        <p
          role="status"
          className="rounded-lg border border-primary/40 bg-primary/10 p-3 text-sm"
        >
          {state.message}
        </p>
      )}
      {errors.form && (
        <ul
          role="alert"
          className="flex flex-col gap-1 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {errors.form.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="roomId">Sala</Label>
        <NativeSelect
          id="roomId"
          name="roomId"
          required
          defaultValue={values?.roomId ?? defaultRoomId ?? ""}
          aria-invalid={!!errors.roomId}
          className="w-full"
        >
          <NativeSelectOption value="" disabled>
            Escolha uma sala
          </NativeSelectOption>
          {rooms.map((room) => (
            <NativeSelectOption key={room.id} value={room.id}>
              {room.name} ({room.capacity} pessoas)
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <FieldError messages={errors.roomId} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="date">Data</Label>
        <Input
          id="date"
          name="date"
          type="date"
          required
          min={today}
          defaultValue={values?.date ?? today}
          aria-invalid={!!errors.date}
        />
        <FieldError messages={errors.date} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="start">Início</Label>
          <Input
            id="start"
            name="start"
            type="time"
            required
            step={300}
            defaultValue={values?.start}
            aria-invalid={!!errors.start}
          />
          <FieldError messages={errors.start} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="end">Fim</Label>
          <Input
            id="end"
            name="end"
            type="time"
            required
            step={300}
            defaultValue={values?.end}
            aria-invalid={!!errors.end}
          />
          <FieldError messages={errors.end} />
        </div>
      </div>

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Reservando..." : "Reservar"}
      </Button>
    </form>
  );
}
