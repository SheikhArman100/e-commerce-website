import ChangePasswordForm from "./ChangePasswordForm";

export const metadata = {
  title: "Change Password | Baking Tales",
  description: "Update your Baking Tales account password.",
};

const ChangePassword = () => {
  return (
    <article className="w-full bg-bgColor min-h-screen text-textColor flex flex-col items-center justify-center md:pt-[7rem] md:pb-8 px-8">
      <section className="w-full sm:w-[75%] md:w-[50%] lg:w-[36%] flex flex-col items-center py-12">
        <h2 className="text-3xl font-medium text-accentColor font2">Change Password</h2>
        <p className="mt-2 text-sm text-stone-500">
          Enter your old password and choose a new one.
        </p>
        <ChangePasswordForm />
      </section>
    </article>
  );
};

export default ChangePassword;
