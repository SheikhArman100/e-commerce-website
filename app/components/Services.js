"use client";
import SectionTitle from "@/Components/SectionTitle";

const ServiceCard = ({ icon: IconPath, title, description }) => {
  return (
    <div className="group relative flex flex-col items-center p-8 bg-accentColor2/20 border border-textColor/10 rounded-2xl">
      <div className="absolute inset-0 bg-accentColor/0 group-hover:bg-accentColor/5 rounded-2xl blur-2xl -z-10" />

      <div className="relative mb-8 p-6 rounded-full bg-bgColor border border-textColor/10 group-hover:border-accentColor/40 shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="transparent"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-12 w-12 lg:h-16 lg:w-16 stroke-accentColor"
        >
          <path d={IconPath} />
        </svg>
      </div>

      <div className="flex flex-col items-center text-center space-y-4">
        <h4 className="text-2xl font-semibold text-accentColor font2 tracking-wide leading-tight">
          {title}
        </h4>
        <p className="text-stone-500 text-sm font-light leading-relaxed max-w-[240px]">
          {description}
        </p>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-accentColor group-hover:w-1/3" />
    </div>
  );
};

const Services = () => {
  const servicesData = [
    {
      title: "Artisanal Craft",
      description:
        "Every delicacy is meticulously hand-crafted in our studio using traditional techniques.",
      icon: "M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8 M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1 M2 21h20 M7 8v2 M12 8v2 M17 8v2 M7 4h.01 M12 4h.01 M17 4h.01",
    },
    {
      title: "Home Delivery",
      description:
        "We ensure your delicate treats arrive in perfect condition through our specialized white-glove service.",
      icon: "M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11 M14 9h4l4 4v4c0 .6-.4 1-1 1h-2 M5 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M5 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0 M15 18H9 M15 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
    },
    {
      title: "Gift of Joy",
      description:
        "Elegantly packaged with custom notes and artisanal chocolate accents for those special moments.",
      icon: "M20 12L20 22L4 22L4 12 M2 7h20v5H2Z M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z",
    },
  ];

  return (
    <section className="relative w-full pt-24 pb-12 px-6 md:px-12 lg:px-24 overflow-hidden bg-bgColor">
      <div className="absolute inset-0 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-full bg-accentColor/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <SectionTitle title="Our Commitment" />

        <h3 className="text-3xl md:text-4xl lg:text-5xl text-accentColor font2 mt-4 mb-20 text-center max-w-2xl leading-tight">
          Excellence in Every Detail
        </h3>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-[1400px]">
          {servicesData.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
