import { Chip, ChipGroup, Flex } from "@mantine/core";
import classes from "../../styles/communitystyles/CommunityCategoryChip.module.css"

interface CommunityCategoryFilterProps{
    value: string | null;
    onChange: (value: string | null) => void;
};

const categories = [
    {value: "anime", label: "Anime"},
    {value: "movies", label: "Movies"},
    {value: "gaming", label: "Gaming"},
    {value: "sports", label: "Sports"},
    {value: "coding", label: "Coding"},
    {value: "technology", label: "Technology"},
    {value: "music", label: "Music"},
    {value: "book", label: "Books"},
    {value: "general", label: "General"}
];

export function CommunityCategoriesChips({
    value,
    onChange,
} : CommunityCategoryFilterProps){
    return(
        <ChipGroup
            multiple={false}
            value={value}
            onChange={(value) => onChange(value)}>
            <Flex gap='xs' wrap="wrap">
                <Chip
                    checked={value === null}
                    onChange={() => onChange(null)}
                    variant="outline"
                    classNames={{
                        label: classes.chip,
                    }}>
                    All
                </Chip>
                {categories.map((category) => (
                    <Chip
                        key={category.value}
                        value={category.value}
                        variant='outline'
                        classNames={{
                            label: classes.chip,
                        }}>
                        {category.label}
                    </Chip>
                ))}
            </Flex>
        </ChipGroup>
    )
}