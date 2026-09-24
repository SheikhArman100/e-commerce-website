import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata = {
  title: "Reset Password | Baking Tales",
  description: "Choose a new password for your Baking Tales account.",
};

const ResetPassword = () => {
  return (
    <article className="w-full bg-bgColor min-h-screen text-textColor flex flex-col items-center justify-center md:pt-[7rem] md:pb-8 px-8">
      <section className="w-full sm:w-[75%] md:w-[50%] lg:w-[36%] flex flex-col items-center py-12">
        <h2 className="text-3xl font-medium text-accentColor font2">Reset Password</h2>
        <p className="mt-2 text-sm text-stone-500">
          Choose a new password for your account.
        </p>
        {/* useSearchParams() inside the form needs a Suspense boundary */}
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </section>
    </article>
  );
};

export default ResetPassword;
