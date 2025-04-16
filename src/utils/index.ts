import { Experiment } from "./types";

// Initialize const once to avoid unnecessary searching of locale db
const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
});

export function formatDate(timestamp: string) {
  const d = new Date(timestamp);
  return dateTimeFormatter.format(d);
}

export function getWinningVariant(experiment: Experiment): string | undefined {
  const winningVariantId = experiment.resultSummary?.winner;
  const winningVariant = experiment.variations.find(
    (variation) => variation.variationId === winningVariantId
  );
  return winningVariant?.name;
}
