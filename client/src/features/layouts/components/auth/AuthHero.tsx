import { Text, Title } from "@mantine/core";
import { motion, useReducedMotion } from "motion/react";
import classes from "../../../../styles/authstyles/AuthHero.module.css";
import cityscape from "../../../../assets/pulsehub_cityscape_mobile.png";
import mark from "../../../../assets/pulsehub-mark.svg";

export function AuthHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={classes.hero}>
      <img src={cityscape} alt="" className={classes.art} />
      <div className={classes.scrim} aria-hidden />
      <div className={classes.vignette} aria-hidden />

      <div className={classes.content}>
        <div className={classes.topCluster}>
          <div className={classes.brandRow}>
            <motion.img
              src={mark}
              alt="PulseHub"
              className={classes.mark}
              animate={shouldReduceMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={
                shouldReduceMotion
                  ? undefined
                  : { duration: 3, ease: "easeInOut", repeat: Infinity }
              }
              style={{ willChange: "transform" }}
            />
            <Text className={classes.brand}>PulseHub</Text>
          </div>

          <Title className={classes.title}>
            Talk about what you love.
          </Title>
          <Text className={classes.subtitle}>
            Join communities around anime, gaming, coding and more...
          </Text>
        </div>

        <div className={classes.bottom}>
          <div className={classes.meta}>
            <span>Anime</span>
            <span>Gaming</span>
            <span>Coding</span>
          </div>
        </div>
      </div>
    </div>
  );
}