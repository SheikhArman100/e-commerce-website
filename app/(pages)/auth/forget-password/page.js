import Link from "next/link";
import ForgetPasswordForm from "./ForgetPasswordForm";

export const metadata = {
  title: "Forgot Password | Baking Tales",
  description: "Request a password reset link for your Baking Tales account.",
};

const ForgetPassword = () => {
  return (
    <article className="w-full bg-bgColor min-h-screen text-textColor flex flex-col items-center justify-center md:pt-[7rem] md:pb-8 px-8">
      <section className="w-full sm:w-[75%] md:w-[50%] lg:w-[36%] flex flex-col items-center py-12">
        <h2 className="text-3xl font-medium text-accentColor font2">Forgot Password</h2>
        <p className="mt-2 text-sm text-stone-500">
          Enter your account email and we will send you a reset link.
        </p>
        <ForgetPasswordForm />
        <p className="mt-4 text-base font-medium text-stone-500">
          Remembered it?
          <Link href="/auth/signin" className="underline text-accentColor ml-1">
            Sign in
          </Link>
        </p>
      </section>
    </article>
  );
};

export default ForgetPassword;
