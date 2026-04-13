import signUpImage from "@/public/assets/signup.jpg";
import Image from "next/image";
import Link from "next/link";
import FormSignup from "./FormSignup";

const Signup = () => {
  return (
    <article className="w-full min-h-screen mt-4  text-textColor border-t border-textColor/10 flex flex-col items-center justify-center   md:pt-[7rem] md:pb-8 px-8 lg:px-[2rem] xl:px-[4rem] md:grid md:grid-cols-2 ">
      <section className="bg-accentColor/5 hidden md:block w-full h-full lg:h-[80%]">
        <div className="w-full h-full  relative">
          <Image
            src={signUpImage}
            fill
            placeholder="blur"
            alt="signin"
            className="w-full h-full  object-cover"
          />
        </div>
      </section>
      <section className=" w-full sm:w-[75%] md:w-full   flex flex-col items-center py-12 md:px-8 lg:px-[4rem] xl:px-[8rem]">
        <h2 className="text-3xl font-medium">Create New Account</h2>
        <FormSignup/>
        <p className="mt-4 text-base font-medium">
          Already have an account?
          <Link href="/auth/signin" className="underline">
            Sign in
          </Link>
        </p>
      </section>
    </article>
  );
};

export default Signup;
