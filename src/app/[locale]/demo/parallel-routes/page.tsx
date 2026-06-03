// src/app/[locale]/demo/parallel-routes/page.tsx
import { ParallelRoutesDemoContent } from "@/features/demo/ParallelRoutesDemoContent";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";

type ParallelRoutesDemoPageProps = {
  params: LocaleParams;
};

export default async function ParallelRoutesDemoPage({
  params,
}: ParallelRoutesDemoPageProps) {
  const locale = await getLocaleFromParams(params);

  return <ParallelRoutesDemoContent locale={locale} mode="children-only" />;
}
