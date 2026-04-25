import { revalidatePath } from "next/cache";

import { routing } from "@/i18n/routing";

export function revalidatePlatformPaths(username?: string) {
  revalidatePath("/");
  revalidatePath("/discover");
  revalidatePath("/dashboard", "layout");

  for (const locale of routing.locales) {
    if (locale !== routing.defaultLocale) {
      revalidatePath(`/${locale}`);
      revalidatePath(`/${locale}/discover`);
      revalidatePath(`/${locale}/dashboard`, "layout");

      if (username) {
        revalidatePath(`/${locale}/u/${username}`);
      }
    }
  }

  if (username) {
    revalidatePath(`/u/${username}`);
  }
}
