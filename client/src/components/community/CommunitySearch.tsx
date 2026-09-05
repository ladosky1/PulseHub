import { TextInput, Loader } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import classes from "../../styles/communitystyles/CommunitySearch.module.css"

interface CommunitySearchProps{
    value: string;
    onChange: (value: string) => void;
    loading?: boolean;
};

export function CommunitySearch({
    value,
    onChange,
    loading
}: CommunitySearchProps){
    return(
        <TextInput
            placeholder="Search communities..."
            value={value}
            onChange={(event) => onChange(event.currentTarget.value)}
            rightSection={loading ? <Loader size='xs'/> : null}
            leftSection={<IconSearch size={18} stroke={1.6}/>}
            radius="sm"
            classNames={{
                input: classes.input,
                section: classes.section,
            }}/>
    )
}