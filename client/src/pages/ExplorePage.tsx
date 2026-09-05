import {
    Alert,
    SimpleGrid,
    Text,
    Stack,
    Container,
} from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks";
import { IconAlertCircle } from "@tabler/icons-react";
import { ExploreHero } from "../components/community/ExploreHero";
import { CommunityCard } from "../components/community";
import { CommunityCardSkeleton } from "../components/community/CommunitySkeleton";
import { useCommunities } from "../features/community/hooks/useCommunities";
import { useState } from "react";
import classes from "../styles/communitystyles/ExplorePage.module.css"

export function ExplorePage(){
    const [search, setSearch] = useState('');

    const [category, setCategory] = useState<string | null>(null);

    const [debouncedSearch] = useDebouncedValue(search, 500);

    const {
        data: communities,
        isPending,
        isFetching,
        isError,
        error
    } = useCommunities({
        search: debouncedSearch,
        category: category?? undefined,
    });

    if(isError){
        return(
            <Alert
                color="red"
                icon={<IconAlertCircle size={18} />}
                >
                {error.message}
            </Alert>
        )
    }
    return (
    <div className={classes.page}>
        <section className={classes.heroSection}>
            <ExploreHero
                search={search}
                onSearchChange={setSearch}
                category={category}
                onCategoryChange={setCategory}
                loading={isFetching}/>
        </section>

        <Container
            size="xl"
            px={{ base: "md", sm: "lg" }}
            className={classes.communitySection}>
            <Stack gap="lg">
                <Text
                    size="sm"
                    c="dimmed">
                    {communities?.length?? 0} communities found
                </Text>

                <SimpleGrid
                    cols={{
                        base: 1,
                        sm: 2,
                    }}
                    spacing="lg"
                    verticalSpacing="lg">
                    {isPending? (
                        <>
                            <CommunityCardSkeleton />
                            <CommunityCardSkeleton />
                            <CommunityCardSkeleton />
                            <CommunityCardSkeleton />
                        </>
                    ) : (
                        communities?.map((community) => (
                            <CommunityCard
                                key={community.id}
                                community={community}/>
                        ))
                    )}
                </SimpleGrid>
            </Stack>
        </Container>
    </div>
    );
}