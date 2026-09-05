import { Button, type ButtonProps } from "@mantine/core";
import type { ComponentPropsWithoutRef } from "react";

type PrimaryButtonProps = ButtonProps & ComponentPropsWithoutRef<"button">;

export function PrimaryButton({
    children,
    ...props
} : PrimaryButtonProps){
    return(
        <Button
            variant="gradient"
            gradient={{ 
                from: 'indigo', 
                to: 'violet', 
                deg: 135 
            }}
            {...props}
        >
            {children}
        </Button>
    )
}