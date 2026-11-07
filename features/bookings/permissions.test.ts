import { describe, expect, it } from "vitest";
import { canCancelBooking } from "./permissions";

const now = new Date("2026-11-10T12:00:00Z");
const owner = { id: "daiane" };
const booking = {
  userId: "daiane",
  startsAt: new Date("2026-11-10T13:00:00Z"),
  cancelledAt: null,
};

describe("canCancelBooking", () => {
  it("lets the owner cancel a future booking", () => {
    expect(canCancelBooking(owner, booking, now)).toEqual({ ok: true });
  });

  it("does not let another user cancel it", () => {
    expect(canCancelBooking({ id: "bruno" }, booking, now)).toEqual({
      ok: false,
      reason: "NOT_FOUND",
    });
  });

  it("does not let an admin cancel someone else's booking", () => {
    expect(canCancelBooking({ id: "yago" }, booking, now)).toEqual({
      ok: false,
      reason: "NOT_FOUND",
    });
  });

  it("reports a missing booking the same way as someone else's", () => {
    expect(canCancelBooking(owner, null, now)).toEqual({
      ok: false,
      reason: "NOT_FOUND",
    });
  });

  it("rejects a booking that was already cancelled", () => {
    expect(
      canCancelBooking(owner, { ...booking, cancelledAt: now }, now),
    ).toEqual({ ok: false, reason: "ALREADY_CANCELLED" });
  });

  it("rejects a booking that has already started", () => {
    expect(canCancelBooking(owner, { ...booking, startsAt: now }, now)).toEqual(
      { ok: false, reason: "ALREADY_STARTED" },
    );
  });
});
