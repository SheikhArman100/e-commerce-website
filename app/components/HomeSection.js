const HomeSection = ({ children }) => {
  return (
    <main className="">
      <div className="min-h-screen relative w-full flex flex-col bg-bgColor ">
        {children}
      </div>
    </main>
  );
};

export default HomeSection;
