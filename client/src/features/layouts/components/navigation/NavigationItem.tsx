import { NavLink, useMatches } from "@mantine/core";
import { NavLink as RouterNavlink } from "react-router-dom";
import type { NavigationItem as NavigationItemType } from "./navigations";
import { NotificationBadge } from "../../../notifications/component/NotificationBadge";
import classes from "../../../../styles/NavigationItem.module.css";

interface NavigationItemProps {
    item: NavigationItemType;
    close: () => void;
};

export function NavigationItems({ item, close }: NavigationItemProps){
    const Icon = item.icon;

    const isMobile = useMatches({
        base: true,
        md: false,
    })

    return(
        <NavLink
            component={RouterNavlink}
            to={item.path}
            label={item.label}
            leftSection={<Icon size={16} stroke={1.8}/>}
            rightSection={
                item.path === "/notifications"
                    ? <NotificationBadge/>
                    : undefined
            }
            end={item.path === '/'}
            onClick={() => {
                if(isMobile){
                    close();
                }
            }}
            variant="light"
            color="indigo"
            styles={{
                root: {
                    borderRadius: "10px",
                    padding: "10px 12px",
                    transition: "background-color 150ms ease",
                },

                label: {
                    fontWeight: 500,
                },
            }}
            classNames={{
                root: classes.root,
            }}/>
    )
}