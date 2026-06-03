// src/app/[locale]/demo/parallel-routes/with-modal/page.tsx
import { ParallelRoutesDemoContent } from "@/features/demo/ParallelRoutesDemoContent";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";

type ParallelRoutesWithModalPageProps = {
  params: LocaleParams;
};

export default async function ParallelRoutesWithModalPage({
  params,
}: ParallelRoutesWithModalPageProps) {
  const locale = await getLocaleFromParams(params);

  return <ParallelRoutesDemoContent locale={locale} mode="with-modal" />;
}
