import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { htmlName?: string }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, htmlName, ...props }, ref) => {
    return (
      <input
        type={type}
        name={htmlName}
        className={className}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
