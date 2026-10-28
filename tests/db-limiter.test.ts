import { describe, expect, it } from "vitest";
import { createLimiter } from "@/lib/server/db";

describe("query limiter", () => {
  it("never runs more than the limit at once, and runs everything", async () => {
    const limit = createLimiter(3);
    let active = 0;
    let peak = 0;
    const results = await Promise.all(
      Array.from({ length: 20 }, (_, index) =>
        limit(async () => {
          active += 1;
          peak = Math.max(peak, active);
          await new Promise((resolve) => setTimeout(resolve, 2 + (index % 4)));
          active -= 1;
          return index;
        })
      )
    );
    expect(peak).toBe(3);
    expect(results).toEqual(Array.from({ length: 20 }, (_, index) => index));
  });

  it("releases the slot when a task fails", async () => {
    const limit = createLimiter(1);
    await expect(limit(async () => Promise.reject(new Error("boom")))).rejects.toThrow("boom");
    await expect(limit(async () => "next")).resolves.toBe("next");
  });
});
