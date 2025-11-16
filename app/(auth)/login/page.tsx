"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveTokens } from "@/lib/auth";
import { AxiosError } from "axios";
import AuthInput from "@/components/layout/AuthInput";
import AuthButton from "@/components/layout/AuthButton";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.email.trim() || !form.email.includes("@"))
      newErrors.email = "Please enter a valid email address.";

    if (!form.password.trim())
      newErrors.password = "Please enter your password.";

    return newErrors;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // ❌ Do NOT call API
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("password", form.password);

      const res = await api.post("/api/auth/login/", formData);
      saveTokens(res.data.access, res.data.refresh);

      const profileRes = await api.get("/api/users/me/");
      localStorage.setItem("user", JSON.stringify(profileRes.data));

      router.push("/dashboard");
    } catch (err) {
      let message = "Invalid email or password";

      if (err instanceof AxiosError) {
        message = err.response?.data?.message || message;
      }

      setErrors({ password: message }); // show error under password field
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* LEFT — Optional Illustration */}
      <div className="flex-1 bg-indigo-50 flex items-center justify-center p-12">
        {/* Illustration if needed */}
      </div>

      {/* RIGHT FORM */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <h1 className="text-[30px] font-bold mb-2 text-center">Log in to your account</h1>
          <h4 className="font-normal mb-9 text-center text-[#4B5563]">
            Start managing your tasks efficiently
          </h4>

          <form className="space-y-4 relative" onSubmit={handleSubmit}>
            <AuthInput
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => {
                setForm({ ...form, email: v });
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              error={errors.email}
            />

            <AuthInput
              label="Password"
              type="password"
              value={form.password}
              onChange={(v) => {
                setForm({ ...form, password: v });
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              error={errors.password}
              showToggle={true}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-gray-600">Remember me</span>
              </label>

              <Link href="/forgot-password" className="text-[#5272FF] font-medium">
                Forgot your password?
              </Link>
            </div>

            <AuthButton text="Log In" loading={loading} />
          </form>

          <p className="text-center mt-4 text-[#4B5563] font-regular leading-4">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-[#5272FF] font-medium">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
