"use client";

import { useActionState } from "react";

import type { ChemicalRecommendation } from "@/features/water-testing/chemical-recommendations";
import {
  addRecommendedProductsToJobAction,
  type AddRecommendedProductsState,
} from "@/features/water-testing/recommendation-actions";

const initialState: AddRecommendedProductsState = {};

export function RecommendationReviewForm({
  jobId,
  recommendations,
  testId,
}: {
  jobId?: string | null;
  recommendations: ChemicalRecommendation[];
  testId: string;
}) {
  const [state, formAction, isPending] = useActionState(
    addRecommendedProductsToJobAction,
    initialState,
  );
  const products = recommendations.flatMap((recommendation) =>
    recommendation.possibleProducts.map((product) => ({
      id: product.id,
      label: `${product.name} (${recommendation.issue})`,
    })),
  );
  const uniqueProducts = Array.from(
    new Map(products.map((product) => [product.id, product])).values(),
  );

  if (!jobId || uniqueProducts.length === 0) {
    return null;
  }

  return (
    <form action={formAction} className="mt-5 rounded-lg border border-cyan-200 bg-cyan-50 p-4">
      <input name="jobId" type="hidden" value={jobId} />
      <input name="testId" type="hidden" value={testId} />
      <h3 className="text-sm font-semibold text-slate-950">
        Add reviewed products to job notes
      </h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        This records selected products as technician notes only. It does not dose
        automatically or deduct stock.
      </p>
      {state.formError ? (
        <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {state.formError}
        </div>
      ) : null}
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {uniqueProducts.map((product) => (
          <label
            className="flex items-start gap-3 rounded-md border border-cyan-100 bg-white px-3 py-2 text-sm font-medium text-slate-700"
            key={product.id}
          >
            <input
              className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              name="selectedProducts"
              type="checkbox"
              value={product.label}
            />
            {product.label}
          </label>
        ))}
      </div>
      <button
        className="mt-4 inline-flex min-h-10 items-center rounded-md bg-cyan-600 px-4 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Adding to job notes..." : "Add Selected to Job Notes"}
      </button>
    </form>
  );
}
