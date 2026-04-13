import { Star } from 'lucide-react'
import React from 'react'

const SectionTitle = ({title}) => {
  return (
    <div className="flex items-center justify-center gap-x-1">
          <Star fill="#9B2242" stroke="none" className="h-4 w-4" />
          <p className="text-textColor text-[0.8rem] font-medium uppercase tracking-[0.2em]">
            {title}
          </p>
          <Star fill="#9B2242" stroke="none" className="h-4 w-4" />
        </div>
  )
}

export default SectionTitle