"use client"

import { useState } from "react"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { MaterialIcon } from "@/components/landing/atoms/MaterialIcon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(
        /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
        "Must contain a number or symbol"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SetPasswordFormValues = z.infer<typeof setPasswordSchema>

const PASSWORD_RULES = [
  { test: (pw: string) => pw.length >= 8, label: "At least 8 characters" },
  { test: (pw: string) => /[A-Z]/.test(pw), label: "One uppercase letter" },
  {
    test: (pw: string) =>
      /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw),
    label: "One number or symbol",
  },
] as const

export function SetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const passwordValue = form.watch("password")

  async function onSubmit(_values: SetPasswordFormValues) {
    // TODO: Implement set new password logic
  }

  return (
    <Card className="shadow-lg">
      {/* Header with lock_reset icon */}
      <CardHeader className="items-center text-center">
        <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-brand-light">
          <MaterialIcon name="lock_reset" className="text-brand" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">
          Set New Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Please create a strong password to secure your account.
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
            aria-label="Set new password form"
          >
            {/* New Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MaterialIcon
                        name="vpn_key"
                        size="sm"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="........"
                        autoComplete="new-password"
                        className="pl-9 pr-9"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        <MaterialIcon
                          name={showPassword ? "visibility_off" : "visibility"}
                          size="sm"
                        />
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm New Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MaterialIcon
                        name="check_circle"
                        size="sm"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="........"
                        autoComplete="new-password"
                        className="pl-9 pr-9"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((prev) => !prev)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        <MaterialIcon
                          name={
                            showConfirmPassword
                              ? "visibility_off"
                              : "visibility"
                          }
                          size="sm"
                        />
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Requirements Checklist */}
            <div className="rounded border border-slate-100 bg-slate-50 p-4">
              <ul className="space-y-2">
                {PASSWORD_RULES.map((rule) => {
                  const passing = rule.test(passwordValue)
                  return (
                    <li
                      key={rule.label}
                      className="flex items-center gap-2 text-sm"
                    >
                      <MaterialIcon
                        name={passing ? "check" : "radio_button_unchecked"}
                        size="sm"
                        className={
                          passing ? "text-green-500" : "text-slate-300"
                        }
                      />
                      <span
                        className={
                          passing ? "text-green-700" : "text-slate-500"
                        }
                      >
                        {rule.label}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
              size="lg"
            >
              {form.formState.isSubmitting
                ? "Updating..."
                : "Update Password"}
            </Button>
          </form>
        </Form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-800"
          >
            <MaterialIcon name="arrow_back" size="sm" />
            Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
