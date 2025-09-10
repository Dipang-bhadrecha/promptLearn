import * as React from "react"
import { cn } from "../../lib/utils"

function ButtonDropdown({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex items-center justify-center bg-transparent border-none shadow-none p-0 cursor-pointer",
        "hover:scale-150 transition-transform duration-150 ease-in-out",
        "active:scale-95",
        "focus-visible:ring-0 focus:outline-none",
        className
      )}
    />
  )
}

export { ButtonDropdown }
