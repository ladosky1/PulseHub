import { Stack, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import cityNight from "../../assets/pulsehub_city_night.jpg"

import { PrimaryButton } from "../buttons";
import { CreateCommunityModal } from "./CommunityModal";
import { CommunitySearch } from "./CommunitySearch";
import { CommunityCategoriesChips } from "./CommunityCategoryChips";
import classes from "../../styles/communitystyles/ExploreHero.module.css";

interface ExploreHeroProps {
    search: string;
    onSearchChange: (value: string) => void;
    category: string | null;
    onCategoryChange: (value: string | null) => void;
    loading: boolean;
}

export function ExploreHero({
    search,
    onSearchChange,
    category,
    onCategoryChange,
    loading,
} : ExploreHeroProps) {
    const [createOpened, setCreateOpened] = useState(false);

    return (
        <>
            <section className={classes.wrapper}>
                <div className={classes.hero}>
                    <div className={classes.heroVisual}>
                        <img
                            src={cityNight}
                            alt=""
                            className={classes.image}/>

                        <div className={classes.overlay} />
                    </div>

                    <div className={classes.content}>
                        <div className={classes.contentMain}>
                            <Stack gap={6}>
                                <Title order={1} className={classes.title}>
                                    Explore Communities
                                </Title>

                                <Text className={classes.subtitle}>
                                    Discover communities around anime,
                                    gaming, coding and more.
                                </Text>
                            </Stack>
                        </div>

                        <PrimaryButton
                            leftSection={<IconPlus size={18} />}
                            onClick={() => setCreateOpened(true)}
                            className={classes.createButton}>
                            Create Community
                        </PrimaryButton>
                    </div>
                </div>

                <div className={classes.searchPanel}>
                    <Stack gap="md">
                        <Stack gap={4}>
                            <Text fw={600} className={classes.searchHeading}>
                                Find a community
                            </Text>

                            <Text size="sm" className={classes.searchSubheading}>
                                Search or filter communities by category.
                            </Text>
                        </Stack>

                        <Stack gap="sm">
                            <CommunitySearch
                                value={search}
                                onChange={onSearchChange}
                                loading={loading}/>
                            
                            <CommunityCategoriesChips
                                value={category}
                                onChange={onCategoryChange}/>
                        </Stack>
                    </Stack>
                </div>
            </section>

            <CreateCommunityModal
                opened={createOpened}
                onClose={() => setCreateOpened(false)}/>
        </>
    );
}