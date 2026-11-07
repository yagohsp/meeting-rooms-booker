"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { cancelBooking, type CancelBookingState } from "../actions";

const initialState: CancelBookingState = {};

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [state, action, pending] = useActionState(cancelBooking, initialState);

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm("Cancelar esta reserva?")) event.preventDefault();
      }}
      className="flex flex-col items-end gap-1"
    >
      <input type="hidden" name="bookingId" value={bookingId} />
      <Button type="submit" variant="destructive" size="sm" disabled={pending}>
        {pending ? "Cancelando..." : "Cancelar"}
      </Button>
      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
    </form>
  );
}
