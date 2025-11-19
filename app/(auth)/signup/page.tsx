"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PosterWomen from "@/components/logo/PosterWomen";
import AuthInput from "@/components/layout/AuthInput";
import AuthButton from "@/components/layout/AuthButton";
import Link from "next/link";
import { useAuth } from "../contextapi/AuthContext";

interface ErrorResponse {
  response?: {
    data?: {
      errors?: Record<string, string | string[]>;
      message?: string;
      detail?: string;
      email?: string | string[];
      password?: string | string[];
      first_name?: string | string[];
      last_name?: string | string[];
    };
  };
  message?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

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

    if (!form.email.includes("@") || !form.email.includes("."))
      newErrors.email = "Please enter a valid email address.";

    if (form.password.length < 4)
      newErrors.password = "4 characters minimum.";

    if (form.password !== form.confirm_password)
      newErrors.confirm_password = "Passwords do not match.";

    return newErrors;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // Use your AuthContext signup function
      await signup(
        form.email,
        form.password,
        form.first_name,
        form.last_name
      );

      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (err: unknown) {
      console.log("SIGNUP ERROR:", err);
      
      // Handle different error response formats
      const error = err as ErrorResponse;
      const errorData = error.response?.data;
      
      let errorMessage = "Signup failed.";
      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.detail) {
        errorMessage = errorData.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Handle field-specific errors
      const fieldErrors: Record<string, string> = {};
      
      if (errorData?.errors) {
        Object.keys(errorData.errors).forEach((key) => {
          const errorValue = errorData.errors![key];
          if (Array.isArray(errorValue)) {
            fieldErrors[key] = errorValue[0];
          } else if (typeof errorValue === 'string') {
            fieldErrors[key] = errorValue;
          }
        });
      } else if (errorData?.email) {
        fieldErrors.email = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email;
      } else if (errorData?.password) {
        fieldErrors.password = Array.isArray(errorData.password) ? errorData.password[0] : errorData.password;
      } else if (errorData?.first_name) {
        fieldErrors.first_name = Array.isArray(errorData.first_name) ? errorData.first_name[0] : errorData.first_name;
      } else if (errorData?.last_name) {
        fieldErrors.last_name = Array.isArray(errorData.last_name) ? errorData.last_name[0] : errorData.last_name;
      }
      
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT ILLUSTRATION */}
      <div className="flex-1 bg-[#E2ECF8] flex items-center justify-center p-12">
        <PosterWomen />
      </div>

      {/* RIGHT FORM */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-full max-w-md">

          <h1 className="text-[30px] font-bold mb-2 text-center">
            Create your account
          </h1>

          <h4 className="text-[#4B5563] mb-9 text-center">
            Start managing your tasks efficiently
          </h4>

          <form className="space-y-4 relative" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthInput
                label="First Name"
                value={form.first_name}
                inputClass="border border-[#D1D5DB] rounded-lg h-[42px]"
                labelClass="text-sm font-medium text-[#000000]"
                onChange={(v) => {
                  setForm({ ...form, first_name: v });
                  setErrors((prev) => ({ ...prev, first_name: "" }));
                }}
                error={errors.first_name}
              />

              <AuthInput
                label="Last Name"
                value={form.last_name}
                inputClass="border border-[#D1D5DB] rounded-lg h-[42px]"
                labelClass="text-sm font-medium text-[#000000]"
                onChange={(v) => {
                  setForm({ ...form, last_name: v });
                  setErrors((prev) => ({ ...prev, last_name: "" }));
                }}
                error={errors.last_name}
              />
            </div>

            <AuthInput
              label="Email"
              type="email"
              value={form.email}
              inputClass="border border-[#D1D5DB] rounded-lg h-[42px]"
              labelClass="text-sm font-medium text-[#000000]"
              onChange={(v) => {
                setForm({ ...form, email: v });
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              error={errors.email}
            />

            <AuthInput
              label="Password"
              type="password"
              showToggle
              value={form.password}
              inputClass="border border-[#D1D5DB] rounded-lg h-[42px]"
              labelClass="text-sm font-medium text-[#000000]"
              onChange={(v) => {
                setForm({ ...form, password: v });
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              error={errors.password}
            />

            <AuthInput
              label="Confirm Password"
              type="password"
              value={form.confirm_password}
              inputClass="border border-[#D1D5DB] rounded-lg h-[42px]"
              labelClass="text-sm font-medium text-[#000000]"
              onChange={(v) => {
                setForm({ ...form, confirm_password: v });
                setErrors((prev) => ({ ...prev, confirm_password: "" }));
              }}
              error={errors.confirm_password}
            />

            <AuthButton text="Sign Up" loading={loading} />
          </form>

          <p className="text-center mt-4 text-[#4B5563]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#5272FF] font-medium">
              Log in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
