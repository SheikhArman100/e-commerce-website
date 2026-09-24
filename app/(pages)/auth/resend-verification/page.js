import Link from "next/link";
import ResendVerificationForm from "./ResendVerificationForm";

export const metadata = {
  title: "Resend Verification | Baking Tales",
  description: "Resend your Baking Tales email verification link.",
};

const ResendVerification = () => {
  return (
    <article className="w-full bg-bgColor min-h-screen text-textColor flex flex-col items-center justify-center md:pt-[7rem] md:pb-8 px-8">
      <section className="w-full sm:w-[75%] md:w-[50%] lg:w-[36%] flex flex-col items-center py-12">
        <h2 className="text-3xl font-medium text-accentColor font2">Verify Email</h2>
        <p className="mt-2 text-sm text-stone-500">
          Didn&apos;t get the link, or did it expire? Enter your email below.
        </p>
        <ResendVerificationForm />
        <p className="mt-4 text-base font-medium text-stone-500">
          Back to
          <Link href="/auth/signin" className="underline text-accentColor ml-1">
            Sign in
          </Link>
        </p>
      </section>
    </article>
  );
};

export default ResendVerification;
