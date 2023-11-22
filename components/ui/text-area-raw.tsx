import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { htmlName?: string }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, htmlName, ...props }, ref) => {
    return (
      <textarea
        name={htmlName}
        className={cn(
          "",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
