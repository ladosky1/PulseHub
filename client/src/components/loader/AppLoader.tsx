import { motion, useReducedMotion } from "motion/react";
import mark from "../../assets/pulsehub-mark.svg";
import classes from "../../styles/loaderstyles/AppLoader.module.css";

export function AppLoader() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={classes.root} aria-busy="true" aria-live="polite">
      <div className={classes.content}>
        <motion.img
          src={mark}
          alt="PulseHub"
          className={classes.mark}
          animate={shouldReduceMotion ? undefined : { scale: [1, 1.035, 1] }}
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 2.2,
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
      </div>
    </div>
  );
}