import Link from "next/link";

import { SectionPage } from "@/components/app-shell/section-page";
import { CustomerForm } from "@/features/customers/customer-form";

export default function NewCustomerPage() {
  return (
    <SectionPage
      title="Add Customer"
      description="Create a customer billing profile. Service sites, pools, jobs, and portal access remain separate workflows."
    >
      <div className="flex">
        <Link
          className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
          href="/customers"
        >
          Back to customers
        </Link>
      </div>

      <CustomerForm />
    </SectionPage>
  );
}
