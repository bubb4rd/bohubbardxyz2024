import { updateTag } from "next/cache";

export const PORTFOLIO_TAG = "portfolio";

export function revalidatePortfolio() {
  updateTag(PORTFOLIO_TAG);
}
