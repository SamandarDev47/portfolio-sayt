"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, LoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  registerAction,
  requestPasswordResetAction,
  resetPasswordAction,
} from "@/actions/auth";
import { FormFeedback } from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/routing";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  type LoginInput,
  type RegisterInput,
  type ResetPasswordInput,
} from "@/lib/validators/auth";
import { localizedHref } from "@/lib/utils";

type ProviderRailProps = {
  locale: string;
  enableGithub?: boolean;
  enableGoogle?: boolean;
};

function ProviderRail({
  locale,
  enableGithub,
  enableGoogle,
}: ProviderRailProps) {
  if (!enableGithub && !enableGoogle) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {enableGithub ? (
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            signIn("github", {
              callbackUrl: localizedHref(locale as never, "/dashboard"),
            })
          }
        >
          <Globe className="size-4" />
          GitHub
        </Button>
      ) : null}
      {enableGoogle ? (
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            signIn("google", {
              callbackUrl: localizedHref(locale as never, "/dashboard"),
            })
          }
        >
          Google
        </Button>
      ) : null}
    </div>
  );
}

type AuthCardProps = {
  title: string;
  description: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

function AuthCard({ title, description, footer, children }: AuthCardProps) {
  return (
    <Card className="mx-auto w-full max-w-xl rounded-[2rem]">
      <CardHeader className="space-y-3">
        <CardTitle className="text-3xl">{title}</CardTitle>
        <CardDescription className="text-base leading-7">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
        {footer}
      </CardContent>
    </Card>
  );
}

export function SignInForm({
  locale,
  callbackUrl,
  enableGithub,
  enableGoogle,
}: {
  locale: string;
  callbackUrl?: string;
  enableGithub?: boolean;
  enableGoogle?: boolean;
}) {
  const authT = useTranslations("auth");
  const formsT = useTranslations("forms");
  const commonT = useTranslations("common");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    setError(null);

    startTransition(async () => {
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: callbackUrl ?? localizedHref(locale as never, "/dashboard"),
      });

      if (response?.error) {
        setError(authT("invalidCredentials"));
        return;
      }

      toast.success(authT("signedInSuccess"));
      window.location.href =
        response?.url ?? callbackUrl ?? localizedHref(locale as never, "/dashboard");
    });
  });

  return (
    <AuthCard
      title={authT("signInTitle")}
      description={authT("signInDescription")}
      footer={
        <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <Link href="/forgot-password" className="hover:text-foreground">
            {authT("forgotTitle")}
          </Link>
          <Link href="/sign-up" className="hover:text-foreground">
            {commonT("createPortfolio")}
          </Link>
        </div>
      }
    >
      <ProviderRail locale={locale} enableGithub={enableGithub} enableGoogle={enableGoogle} />
      <form className="space-y-5" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="email">{formsT("email")}</Label>
          <Input id="email" type="email" {...form.register("email")} />
          <p className="mt-2 text-sm text-rose-300">{form.formState.errors.email?.message}</p>
        </div>
        <div>
          <Label htmlFor="password">{formsT("password")}</Label>
          <Input id="password" type="password" {...form.register("password")} />
          <p className="mt-2 text-sm text-rose-300">
            {form.formState.errors.password?.message}
          </p>
        </div>
        <FormFeedback message={error} tone="error" />
        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {commonT("signIn")}
        </Button>
      </form>
    </AuthCard>
  );
}

export function SignUpForm({
  locale,
  enableGithub,
  enableGoogle,
}: {
  locale: string;
  enableGithub?: boolean;
  enableGoogle?: boolean;
}) {
  const authT = useTranslations("auth");
  const formsT = useTranslations("forms");
  const buttonsT = useTranslations("buttons");
  const commonT = useTranslations("common");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      locale: locale as RegisterInput["locale"],
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    setMessage(null);
    startTransition(async () => {
      const result = await registerAction(values);

      if (!result.success) {
        setMessage(result.message);
        for (const [field, errors] of Object.entries(result.fieldErrors ?? {})) {
          form.setError(field as keyof RegisterInput, {
            message: errors?.[0] ?? authT("invalidField"),
          });
        }
        return;
      }

      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: localizedHref(locale as never, "/dashboard"),
      });

      toast.success(result.message);
      window.location.href = response?.url ?? localizedHref(locale as never, "/dashboard");
    });
  });

  return (
    <AuthCard
      title={authT("signUpTitle")}
      description={authT("signUpDescription")}
      footer={
        <div className="text-sm text-muted-foreground">
          <Link href="/sign-in" className="hover:text-foreground">
            {commonT("signIn")}
          </Link>
        </div>
      }
    >
      <ProviderRail locale={locale} enableGithub={enableGithub} enableGoogle={enableGoogle} />
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="fullName">{formsT("fullName")}</Label>
            <Input id="fullName" {...form.register("fullName")} />
            <p className="mt-2 text-sm text-rose-300">
              {form.formState.errors.fullName?.message}
            </p>
          </div>
          <div>
            <Label htmlFor="username">{formsT("username")}</Label>
            <Input id="username" {...form.register("username")} />
            <p className="mt-2 text-sm text-rose-300">
              {form.formState.errors.username?.message}
            </p>
          </div>
        </div>
        <div>
          <Label htmlFor="signUpEmail">{formsT("email")}</Label>
          <Input id="signUpEmail" type="email" {...form.register("email")} />
          <p className="mt-2 text-sm text-rose-300">{form.formState.errors.email?.message}</p>
        </div>
        <div>
          <Label htmlFor="signUpPassword">{formsT("password")}</Label>
          <Input id="signUpPassword" type="password" {...form.register("password")} />
          <p className="mt-2 text-sm text-rose-300">
            {form.formState.errors.password?.message}
          </p>
        </div>
        <FormFeedback message={message} tone="error" />
        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {buttonsT("createAccount")}
        </Button>
      </form>
    </AuthCard>
  );
}

export function ForgotPasswordForm({ locale }: { locale: string }) {
  const authT = useTranslations("auth");
  const formsT = useTranslations("forms");
  const buttonsT = useTranslations("buttons");
  const [message, setMessage] = useState<string | null>(null);
  const [devUrl, setDevUrl] = useState<string | null>(null);
  const [tone, setTone] = useState<"default" | "success" | "error">("default");
  const [isPending, startTransition] = useTransition();

  const form = useForm<{ email: string }>({
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit(({ email }) => {
    setMessage(null);
    setDevUrl(null);

    startTransition(async () => {
      const result = await requestPasswordResetAction({ email }, locale as never);
      setMessage(result.message);
      setTone(result.success ? "success" : "error");
      setDevUrl(result.data?.resetUrl ?? null);

      if (result.success) {
        toast.success(result.message);
      }
    });
  });

  return (
    <AuthCard
      title={authT("forgotTitle")}
      description={authT("forgotDescription")}
      footer={
        <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground">
          {authT("backToSignIn")}
        </Link>
      }
    >
      <form className="space-y-5" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="forgotEmail">{formsT("email")}</Label>
          <Input id="forgotEmail" type="email" {...form.register("email")} />
        </div>
        <FormFeedback message={message} tone={tone} />
        {devUrl ? (
          <FormFeedback
            tone="default"
            message={authT("developmentResetLink", { url: devUrl })}
            className="break-all"
          />
        ) : null}
        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {buttonsT("sendResetLink")}
        </Button>
      </form>
    </AuthCard>
  );
}

export function ResetPasswordForm({
  token,
}: {
  token: string;
}) {
  const authT = useTranslations("auth");
  const formsT = useTranslations("forms");
  const buttonsT = useTranslations("buttons");
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"default" | "success" | "error">("default");
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    setMessage(null);
    startTransition(async () => {
      const result = await resetPasswordAction(values);
      setMessage(result.message);
      setTone(result.success ? "success" : "error");

      if (result.success) {
        toast.success(result.message);
      }
    });
  });

  return (
    <AuthCard title={authT("resetTitle")} description={authT("resetDescription")}>
      <form className="space-y-5" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="newPassword">{formsT("password")}</Label>
          <Input id="newPassword" type="password" {...form.register("password")} />
          <p className="mt-2 text-sm text-rose-300">
            {form.formState.errors.password?.message}
          </p>
        </div>
        <div>
          <Label htmlFor="confirmPassword">{formsT("confirmPassword")}</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...form.register("confirmPassword")}
          />
          <p className="mt-2 text-sm text-rose-300">
            {form.formState.errors.confirmPassword?.message}
          </p>
        </div>
        <FormFeedback message={message} tone={tone} />
        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {buttonsT("resetPassword")}
        </Button>
      </form>
    </AuthCard>
  );
}
