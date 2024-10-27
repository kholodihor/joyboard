import { IoChevronDown } from "react-icons/io5";
import { IoChevronUp } from "react-icons/io5";

interface SubtitleProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  length: number
  title: string
}

const SubTitle = ({ isOpen, setIsOpen, length, title }: SubtitleProps) => {
  return (
    <h4
      className="font-bold text-slate-700 cursor-pointer flex gap-[2px] items-center mb-2"
      onClick={() => setIsOpen(!isOpen)}
    >
      {title}
      {length ? (
        <span className="text-purple-500">{`(${length})`}</span>
      ) : null}
      {isOpen ? <IoChevronUp /> : <IoChevronDown />}
    </h4>
  )
}

export default SubTitle
