"use client"
import React from 'react';
import { cn } from "@/libs/utils";
import { ChevronDown } from "lucide-react";

export const AccordionComponent= ({name,desc}) => {
  return (
    <Accordion>
      <AccordionItem toggle="panel-1">
        {name}
      </AccordionItem>
      <AccordionPanel id="panel-1">
        <p className="mt-4 pb-4">
          {desc}
        </p>
      </AccordionPanel>
    </Accordion>
  );
};

/* Logic */

const Context = React.createContext({});

function Accordion({ children }) {
  const [selected, setSelected] = React.useState();

  const toggleItem = React.useCallback(
    (id) => () => {
      setSelected((prevState) => (prevState !== id ? id : ''));
    },
    [],
  );
  return (
    <Context.Provider value={{ selected, toggleItem }}>
      {children}
    </Context.Provider>
  );
}

//custom hook to consume all accordion values
const useAccordion = () => React.useContext(Context);

const style = {
  item: `flex items-center justify-between py-6 border-b border-textColor/10 cursor-pointer group hover:border-accentColor/20 transition-all duration-500`,
  panel: `overflow-hidden transition-all duration-500 ease-in-out text-stone-500 text-left`,
};

function AccordionItem({ toggle, children, className }) {
  const { selected, toggleItem } = useAccordion();
  const isSelected = selected === toggle;

  return (
    <div
      role="button"
      onClick={toggleItem(toggle)}
      className={`${style.item} ${className}`}
    >
      <span className={cn(
        "text-[0.65rem] uppercase tracking-[0.3em] font-black transition-colors duration-300",
        isSelected ? "text-accentColor" : "text-stone-500 group-hover:text-stone-300"
      )}>
        {children}
      </span>
      <div className={cn(
        "transition-transform duration-500",
        isSelected ? "rotate-180" : "rotate-0"
      )}>
        <ChevronDown size={14} className={isSelected ? "text-accentColor" : "text-stone-600"} />
      </div>
    </div>
  );
}

function AccordionPanel({ children, id }) {
  const { selected } = useAccordion();
  const ref = React.useRef();
  const inlineStyle =
    selected === id ? { height: ref.current?.scrollHeight } : { height: 0 };

  return (
    <div ref={ref} id={id} className={style.panel} style={inlineStyle}>
      {children}
    </div>
  );
}