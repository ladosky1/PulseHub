import {
    Button,
    Modal,
    Select,
    Stack,
    Textarea,
    TextInput,
} from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { useCreateCommunity } from "../../features/community/hooks/useCreateCommunity";

import classes from "../../styles/communitystyles/CommunityModal.module.css";

interface CreateCommunityModalProps {
    opened: boolean;
    onClose: () => void;
};

interface CreateCommunityForm {
    name: string;
    description: string;
    category: string;
}

const categories = [
    { value: "anime", label: "Anime" },
    { value: "gaming", label: "Gaming" },
    { value: "sports", label: "Sports" },
    { value: "coding", label: "Coding" },
    { value: "technology", label: "Technology" },
    { value: "music", label: "Music" },
    { value: "books", label: "Books" },
    { value: "movies", label: "Movies" },
    { value: "general", label: "General" }
];

export function CreateCommunityModal({
    opened,
    onClose,
} : CreateCommunityModalProps){
    const { 
        mutate: createCommunity, 
        isPending
    } = useCreateCommunity();

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateCommunityForm>({
        defaultValues: {
            name: "",
            description: "",
            category: "",
        },
    });

    const onSubmit = (values: CreateCommunityForm) => {
        createCommunity(
            {
                name: values.name,
                description: values.description || undefined,
                category: values.category,
            },
            {
                onSuccess: () => {
                    reset();
                    onClose();
                }
            }
        )
    }
    return (
                <Modal
            opened={opened}
            onClose={onClose}
            title="Create a community"
            centered
            radius="lg"
            size="md"
            classNames={{
                content: classes.modal,
                header: classes.modalHeader,
                title: classes.modalTitle,
                body: classes.modalBody,
                close: classes.closeButton,
            }}>
            <form
                className={classes.form}
                onSubmit={handleSubmit(onSubmit)}>
                <Stack gap="lg">
                    <TextInput
                        label="Community name"
                        placeholder="e.g. One Piece Fans"
                        required
                        {...register("name", {
                            required: "Community name is required",
                            minLength: {
                                value: 3,
                                message: "Name must be at least 3 characters",
                            },
                            maxLength: {
                                value: 50,
                                message: "Name must not exceed 50 characters"
                            },
                        })}
                        error={errors.name?.message}
                        classNames={{
                            input: classes.input,
                            label: classes.label,
                        }}
                    />
                    
                    <Textarea
                        label="Description"
                        placeholder="What is this community about?"
                        minRows={3}
                        {...register("description", {
                            maxLength: {
                                value: 500,
                                message: "Description must not exceed 500 characters"
                            }
                        })}
                        error={errors.description?.message}
                        classNames={{
                            input: classes.input,
                            label: classes.label,
                        }}
                    />
                    
                    <Controller
                        name="category"
                        control={control}
                        rules={{
                            required: "Select a category",
                        }}
                        render={({ field }) => (
                            <Select
                                label="Category"
                                placeholder="Choose a category"
                                data={categories}
                                required
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.category?.message}
                                classNames={{
                                    input: classes.input,
                                    label: classes.label,
                                }}
                            />
                        )}
                    />

                    <Button
                        className={classes.submitButton}
                        type="submit"
                        loading={isPending}
                        radius="md">
                        Create Community
                    </Button>
                </Stack>
            </form>
        </Modal>
    )
}