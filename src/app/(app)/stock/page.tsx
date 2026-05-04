import { SectionPage } from "@/components/app-shell/section-page";
import { StockWorkspace } from "@/features/stock/stock-workspace";

export default function StockPage() {
  return (
    <SectionPage
      title="Stock"
      description="Van inventory, low-stock warnings, mock stock movement, supplier placeholders, and job consumption tracking."
    >
      <StockWorkspace />
    </SectionPage>
  );
}
