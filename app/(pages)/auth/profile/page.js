import StatusChecker from "@/Components/StatusChecker.js";
import ProfileDetails from "./ProfileDetails.js";

export const metadata = {
  title: "My Profile | Baking Tales",
  description: "View and manage your Baking Tales account profile.",
};

const ProfilePage = () => {
  return (
    <StatusChecker>
      <article className="w-full bg-bgColor min-h-screen text-textColor flex flex-col items-center md:pt-[7rem] md:pb-8 px-6 py-24">
        <section className="w-full sm:w-[75%] md:w-[60%] lg:w-[42%] flex flex-col items-center py-12">
          <h2 className="text-3xl font-medium text-accentColor font2">
            My Profile
          </h2>
          <p className="mt-2 text-sm text-stone-500 text-center">
            Your account details with Baking Tales.
          </p>
          <ProfileDetails />
        </section>
      </article>
    </StatusChecker>
  );
};

export default ProfilePage;
