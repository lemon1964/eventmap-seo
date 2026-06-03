// src/app/[locale]/login/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/client/api/supabase/server";
import { toNextMetadata } from "@/entities/seo/toNextMetadata";
import { AuthFormClient } from "@/features/auth/AuthFormClient";
import { getSafeAuthNext } from "@/features/auth/authRedirect";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";

type LoginPageSearchParams = Promise<Record<string, string | string[] | undefined>>;

type PageProps = {
  params: LocaleParams;
  searchParams: LoginPageSearchParams;
};

function getFirstSearchValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);

  return toNextMetadata({
    title: locale === "ru" ? "Вход" : "Login",
    description:
      locale === "ru"
        ? "Войдите в EventMap через Magic Link или Google OAuth."
        : "Sign in to EventMap with Magic Link or Google OAuth.",
    canonicalPath: routes.login(locale),
    languageAlternates: {
      en: routes.login("en"),
      ru: routes.login("ru"),
    },
  });
}

export default async function LoginPage({ params, searchParams }: PageProps) {
  const locale = await getLocaleFromParams(params);
  const resolvedSearchParams = await searchParams;
  const defaultNextPath = routes.favorites(locale);
  const nextPath = getSafeAuthNext(
    getFirstSearchValue(resolvedSearchParams.next),
    defaultNextPath,
  );
  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null } };
  const error = getFirstSearchValue(resolvedSearchParams.error);

  return (
    <section className="container demo-page search-page--product">
      <div className="search-product-hero">
        <p className="hero__eyebrow">Supabase Auth</p>
        <p className="app-muted-copy">
          {locale === "ru" ? "Подробнее об auth flow: " : "Auth flow details: "}
          <Link href={routes.demoSupabaseAuth(locale)}>Demo Lab</Link>
        </p>
      </div>

      {error ? (
        <div className="app-surface app-stack">
          <p className="app-muted-copy">
            {locale === "ru"
              ? "Запрос авторизации не был завершён. Попробуйте войти ещё раз."
              : "The auth request was not completed. Try signing in again."}
          </p>
        </div>
      ) : null}

      <AuthFormClient
        initialUserEmail={data.user?.email ?? null}
        locale={locale}
        nextPath={nextPath}
      />
    </section>
  );
}

