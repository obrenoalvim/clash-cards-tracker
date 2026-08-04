import { describe, expect, it } from "vitest";
import { CARDS, type CardCategory } from "./cards";

const EXPECTED_TOTALS: Record<CardCategory, number> = {
  elixir: 19,
  "dark-elixir": 13,
  "builder-base": 11,
  "super-troop": 17,
};

describe("card roster", () => {
  it("has exactly 60 cards", () => {
    expect(CARDS.length).toBe(60);
  });

  it("matches the official per-category split (19/13/11/17)", () => {
    const counts: Record<string, number> = {};
    for (const card of CARDS) {
      counts[card.category] = (counts[card.category] ?? 0) + 1;
    }
    expect(counts).toEqual(EXPECTED_TOTALS);
  });

  it("has no duplicate ids", () => {
    const ids = CARDS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every card has a non-empty imageUrl and wikiUrl", () => {
    for (const card of CARDS) {
      expect(card.imageUrl, `${card.id} imageUrl`).toMatch(/^https:\/\//);
      expect(card.wikiUrl, `${card.id} wikiUrl`).toMatch(/^https:\/\//);
    }
  });

  it("every card has a Portuguese description", () => {
    for (const card of CARDS) {
      expect(card.descriptionPt, `${card.id} descriptionPt`).toBeTruthy();
    }
  });
});
