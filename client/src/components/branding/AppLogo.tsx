import { Group } from "@mantine/core";
import mark from "../../assets/pulsehub-mark.svg";
import classes from "../../styles/AppLogo.module.css";
import { motion, useReducedMotion } from "motion/react";

export function AppLogo(){
    const shouldReduceMotion = useReducedMotion();

    return(
        <Group gap={0} className={classes.logo} wrap="nowrap">
            <motion.img
              src={mark}
              alt="PulseHub"
              className={classes.mark}
              animate={shouldReduceMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: 3,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }
              }
              style={{ willChange: "transform" }}
            />
            <span className={classes.wordmark}>
                <span className={classes.pulse}>Pulse</span>
                <span className={classes.hub}>Hub</span>
            </span>
        </Group>
    )
}