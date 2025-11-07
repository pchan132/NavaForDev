"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

// กำหนด ว่าเป็น sinIn | signUp
type AuthType = "signIn" | "signUp";

interface AuthFormProps {
  type: AuthType;
  onSubmit: (data: FormDataType) => void;
  errorMessage?: string; // เก็บข้อความ Error
}

interface FormDataType {
  name: string;
  email: string;
  password: string;
}

export default function AuthForm({
  type,
  onSubmit,
  errorMessage,
}: AuthFormProps) {
  /// ข้อมูล
  const [formData, setFormData] = useState<FormDataType>({
    name: "", // ใช้เมื่อ Sign Up
    email: "",
    password: "",
  });

  const [localError, setLocalError] = useState(""); // ✅ ใช้สำหรับตรวจ input ในฟอร์ม;
  const router = useRouter();

  // เมื่อกรอกข้อมูลผู้ใช้ ในฟอร์ม
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // เมื่อกด submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // ไม่ให้ reload หน้า  เพจ

    setLocalError("");

    // ตรวจสอบว่าผู้ใช้กรอกครบหรือยัง
    if (type === "signUp" && !formData.name.trim()) {
      setLocalError("กรุณากรอกอีเมลและรหัสผ่านให้ครบ");
      return;
    }

    if (!formData.email.trim() || !formData.password.trim()) {
      setLocalError("กรุณากรอกอีเมลและรหัสผ่านให้ครบ");
      return;
    }

    // ✅ ส่งข้อมูลออกไปให้ parent (เช่น SignIn.tsx, SignUp.tsx)
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* <h2 className="text-3xl font-bold text-gray-800 text-center">
            {type == "signIn" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </h2> */}
          {/* ถ้า เป็น signUp ให้มี กรอกชื่อ */}
          {/* {type == "signUp" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-b-transparent text-black"
              />
            </div>
          )} */}

          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              อีเมล
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div> */}

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่าน
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div> */}

          {/* <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {type == "signIn" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </button> */}

          {/* ✅ แสดงข้อความ error */}
          {/* {(localError || errorMessage) && (
            <p className="text-red-500 text-center text-sm">
              {localError || errorMessage}
            </p>
          )} */}

          {/* <div className="text-center">
            <span className="text-sm text-gray-600">
              {type == "signIn" ? " ยังไม่มีบัญชี?" : "มีบัญชีแล้ว?"}
            </span>
            <a
              href={type == "signIn" ? "/auth/signup" : "/auth/signin"}
              id="showSignupBtn"
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              {type == "signIn" ? " สมัครสมาชิก" : " เข้าสู่ระบบ"}
            </a>
          </div> */}
          {/* เข้าสู่ระบบด้วย Google */}
          <div className="flex justify-center mt-4">
            <button
              className="flex cursor-pointer bg-blue-400 w-full justify-center px-4 py-2 hover:bg-blue-800 rounded-2xl"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill={"currentColor"}
                viewBox="0 0 24 24"
              >
                {/* Boxicons v3.0 https://boxicons.com | License  https://docs.boxicons.com/free */}
                <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.91 8.91 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625"></path>
              </svg>
              {type == "signIn"
                ? "เข้าสู่ระบบด้วย Google"
                : "สมัครสมาชิกด้วย Google"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
