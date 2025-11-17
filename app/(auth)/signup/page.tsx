"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Illustration from "./poster-woman-holding-up-blue-box-that-says-log-cabin-it.svg";
import AuthIllustration from "@/components/layout/AuthIllustration";
import AuthInput from "@/components/layout/AuthInput";
import AuthButton from "@/components/layout/AuthButton";
import Link from "next/link";
import PosterWomen from "@/components/logo/PosterWomen";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.first_name.trim())
      newErrors.first_name = "Please enter a valid name format.";

    if (!form.last_name.trim())
      newErrors.last_name = "Please enter a valid name format.";

    if (!form.email.includes("@") || !form.email.includes(".")) newErrors.email = "Please enter a valid email address.";

    if (form.password.length < 6) newErrors.password = "4 characters minimum.";

    if (form.password !== form.confirm_password)
      newErrors.confirm_password = "Passwords do not match.";

    return newErrors;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    const validationErrors = validate();

    // ❌ If validation fails → show errors, do NOT load
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/signup/", form);

      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error: any) {
      // Backend returns field-specific errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      toast.error("Signup failed.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* LEFT ILLUSTRATION */}
      <div className="flex-1 bg-indigo-50 flex items-center justify-center p-12">
        <PosterWomen/>
      </div>

      {/* RIGHT FORM */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-full max-w-md">

          <h1 className="text-[30px] font-bold mb-2 text-center ">Create your account</h1>
          <h4 className="font-normal mb-9 text-center text-[#4B5563]">Start managing your tasks efficiently</h4>
          <form className="space-y-4 relative" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthInput
                label="First Name"
                value={form.first_name}
              inputClass= "border border-[#D1D5DB] rounded-lg h-[42px]"
              labelClass="text-sm font-medium text-[#000000]"
                onChange={(v) => {
                  setForm({ ...form, first_name: v });
                  if (v.trim() !== "") setErrors((prev) => ({ ...prev, first_name: "" }));
                }}
                error={errors.first_name}
              />

              <AuthInput
                label="Last Name"
                value={form.last_name}
                inputClass= "border border-[#D1D5DB] rounded-lg h-[42px]"
                labelClass="text-sm font-medium text-[#000000]"
                onChange={(v) => {
                  setForm({ ...form, last_name: v });
                  if (v.trim() !== "") setErrors((prev) => ({ ...prev, last_name: "" }));
                }}
                error={errors.last_name}
              />
            </div>

            <AuthInput
              label="Email"
              type="email"
              value={form.email}
              inputClass= "border border-[#D1D5DB] rounded-lg h-[42px]"
              labelClass="text-sm font-medium text-[#000000]"
              onChange={(v) => {
                setForm({ ...form, email: v });
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              error={errors.email}
            />

            <AuthInput
              label="Password"
              type="password"
              value={form.password}
              inputClass= "border border-[#D1D5DB] rounded-lg h-[42px]"
              labelClass="text-sm font-medium text-[#000000]"
              onChange={(v) => {
                setForm({ ...form, password: v });

                // Clear the error when user starts typing
                if (v.length >= 6) {
                  setErrors((prev) => ({ ...prev, password: "" }));
                }
              }}
              error={errors.password}
              showToggle={true}
            />

            <AuthInput
              label="Confirm Password"
              type="password"
              value={form.confirm_password}
              inputClass= "border border-[#D1D5DB] rounded-lg h-[42px]"
              labelClass="text-sm font-medium text-[#000000]"
              onChange={(v) => {
                setForm({ ...form, confirm_password: v });
                if (errors.confirm_password)
                  setErrors({ ...errors, confirm_password: "" });
              }}
              error={errors.confirm_password}
            />

            <AuthButton text="Sign Up" loading={loading} />

          </form>

          <p className="text-center mt-4 text-[#4B5563] font-regular leading-4">
            Already have an account?{' '}
            <Link href="/login" className="text-[#5272FF] font-medium ">
              Log in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
