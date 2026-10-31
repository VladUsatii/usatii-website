"use client";
import Selector from "../ui/Selector.js";
export default function WorkSelect({label,value,options,onChange,disabled}) {
  return <Selector label={label} value={value} options={options} disabled={disabled} onChange={event=>onChange(event.target.value)}/>;
}
