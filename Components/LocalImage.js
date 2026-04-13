// import fs from "node:fs/promises";
// import { getPlaiceholder } from "plaiceholder";
// import Image from "next/image";
// import { twMerge } from "tailwind-merge";

// export default async function LocalImage({src,className,alt,priority}) {
//   const buffer = await fs.readFile(`./public${src}`);
//   const { base64 } = await getPlaiceholder(buffer);
  

//   return (
//     <Image
//       src={src}
//       className={twMerge(" w-full h-full",className)}
//       fill
//       alt={alt}
//       placeholder="blur"
//       blurDataURL={base64}
//       priority={!!priority}

//     />
//   );
// }
