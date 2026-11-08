import { describe, expect, it } from "vitest";
import {
  completeTimeInput,
  formatTimeInput,
  isCompleteDate,
} from "./time-input";

describe("formatTimeInput", () => {
  it.each([
    ["1430", "14:30"],
    ["930", "09:30"],
    ["9", "09"],
    ["2", "2"],
    ["23", "23"],
    ["2359", "23:59"],
    ["14:3", "14:3"],
    ["9a3:0b", "09:30"],
    ["123456", "12:34"],
  ])("formats %j as %j", (typed, expected) => {
    expect(formatTimeInput(typed)).toBe(expected);
  });
});

describe("completeTimeInput", () => {
  it.each([
    ["", ""],
    ["7", "07:00"],
    ["14", "14:00"],
    ["14:3", "14:30"],
    ["09:30", "09:30"],
    ["24:00", "23:00"],
    ["19:75", "19:59"],
    ["25:99", "23:59"],
  ])("completes %j as %j", (typed, expected) => {
    expect(completeTimeInput(typed)).toBe(expected);
  });
});

describe("isCompleteDate", () => {
  it.each([
    ["2026-11-09", true],
    ["0002-11-09", false],
    ["0202-11-09", false],
    ["", false],
    ["2026-11", false],
  ])("%j is complete: %j", (value, expected) => {
    expect(isCompleteDate(value)).toBe(expected);
  });
});
