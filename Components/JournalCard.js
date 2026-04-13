
import React from "react";
import SectionTitle from "./SectionTitle";
import RemoteImage from "./RemoteImage.js";

const JournalCard = ({ image, title }) => {
  return (
    <div className="flex flex-col items-center gap-y-2">
      <div className="relative w-full h-52 lg:h-72 object-cover scale-95 hover:scale-100 transition-all duration-300 rounded ">
        <RemoteImage
        src={image}
        alt="Journal card image"
        className="rounded "
      />

      </div>

      <div>
        {/* date */}
      <SectionTitle title="13 August,2023" />

      {/* title */}
      <h3 className="text-center text-xl text-textColor font-semibold capitalize">
        {title}
      </h3>
      </div>
    </div>
  );
};

export default JournalCard;
