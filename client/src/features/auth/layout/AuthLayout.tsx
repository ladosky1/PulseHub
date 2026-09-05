import { Box, Center, Paper, SimpleGrid } from "@mantine/core";
import { motion, useReducedMotion } from "motion/react";
import { AuthHero } from "../../layouts/components/auth/AuthHero";
import { Outlet } from "react-router-dom";
import classes from "../../../styles/authstyles/AuthLayout.module.css";

export function AuthLayout() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Box className={classes.root}>
      <Center className={classes.center}>
        <Paper
          component={motion.div}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: 0.5, ease: "easeOut" }
          }
          withBorder
          radius="xl"
          shadow="xl"
          className={classes.shell}
        >
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={0} className={classes.grid}>
            <Box className={classes.heroColumn}>
              <AuthHero />
            </Box>

            <Center className={classes.formColumn}>
              <Box className={classes.formInner}>
                <Outlet />
              </Box>
            </Center>
          </SimpleGrid>
        </Paper>
      </Center>
    </Box>
  );
}