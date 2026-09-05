import {
    createTheme,
    type CSSVariablesResolver,
} from "@mantine/core";

export const theme = createTheme({
    primaryColor: "blue",

    primaryShade: {
        light: 7,
        dark: 6,
    },
    
    colors: {
        dark: [
            "#F5F7FA",
            "#E3E7ED",
            "#C7CDD5",
            "#A7AFBC",
            "#737C89",
            "#3C424D",
            "#2A2F38",
            "#20242B",
            "#181B21",
            "#0B0C0F",
        ],

        blue: [
            "#EEF1FF",
            "#DDE2FF",
            "#C7CEFF",
            "#AAB5FF",
            "#8E9CFF",
            "#7182FF",
            "#5B6FF5",
            "#4F63E8",
            "#4054D4",
            "#3345B5",
        ],
    },

    defaultRadius: "md",

    defaultGradient: {
        from: "blue.7",
        to: "blue.6",
        deg: 135,
    },

    fontFamily: "Inter, sans-serif",

    cursorType: "pointer",

    headings: {
        fontFamily: "Space Grotesk, sans-serif",
        fontWeight: "700",
    },

    other: {
        pageBackgroundLight: "#F5F7FA",
        pageBackgroundDark: "#111318",
        surfaceLight: "#FFFFFF",
        surfaceDark: "#181B21",
        elevatedSurfaceLight: "#FFFFFF",
        elevatedSurfaceDark: "#20242B",
    },
    
    components: {
        Button: {
            defaultProps: {
                radius: "md",
                variant: "filled",
            },
        },

        Paper: {
            defaultProps: {
                bg: "var(--mantine-color-default)",
            },
        },
    },
});

export const cssVariablesResolver: CSSVariablesResolver = () => ({
    variables: {},

    light: {
        "--pulsehub-structural-surface": "#FFFFFF",
        "--pulsehub-community-card-surface": "#FFFFFF",
        "--pulsehub-elevated-surface": "#FFFFFF",
        "--pulsehub-secondary-text": "#5F6875",
        "--pulsehub-muted-text": "#89919D",

        "--mantine-color-body": "#F5F7FA",
        "--mantine-color-text": "#151922",

        "--mantine-color-default": "#FFFFFF",
        "--mantine-color-default-hover": "#F5F7FA",
        "--mantine-color-default-color": "#151922",
        "--mantine-color-default-border": "#E3E7ED",

        "--mantine-primary-color-filled": "#4F63E8",
        "--mantine-primary-color-filled-hover": "#4054D4",

        "--mantine-color-dimmed": "#5F6875",
        "--mantine-color-placeholder": "#89919D",

        "--mantine-color-bright": "#151922",
    },

    dark: {
        "--pulsehub-structural-surface": "#0B0C0F",
        "--pulsehub-community-card-surface": "#181B21",
        "--pulsehub-elevated-surface": "#20242B",
        "--pulsehub-secondary-text": "#A7AFBC",
        "--pulsehub-muted-text": "#737C89",

        "--mantine-color-body": "#111318",
        "--mantine-color-text": "#F5F7FA",

        "--mantine-color-default": "#181B21",
        "--mantine-color-default-hover": "#20242B",
        "--mantine-color-default-color": "#F5F7FA",
        "--mantine-color-default-border": "#2A2F38",

        "--mantine-primary-color-filled": "#5B6FF5",
        "--mantine-primary-color-filled-hover": "#7182FF",

        "--mantine-color-dimmed": "#A7AFBC",
        "--mantine-color-placeholder": "#737C89",

        "--mantine-color-bright": "#F5F7FA",
    },
});