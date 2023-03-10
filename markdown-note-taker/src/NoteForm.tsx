import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable";
import { NoteData, Tag } from "./App";
import { v4 as uuidV4 } from "uuid";

type NoteFormProps = {
    onSubmit: (noteData: NoteData) => void;
    onAddTag: (tag: Tag) => void;
    availableTags: Tag[];
    initialTitle?: string;
    initialMarkdown?: string;
    initialTags?: Tag[];
};

export function NoteForm({
                             onSubmit,
                             onAddTag,
                             availableTags,
                             initialTitle = "",
                             initialMarkdown = "",
                             initialTags = [],
                         }: NoteFormProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const markdownRef = useRef<HTMLTextAreaElement>(null);
    const [selectedTags, setSelectedTags] = useState<Tag[]>(initialTags);
    const navigate = useNavigate();

    function handleFormSubmit(e: FormEvent) {
        e.preventDefault();

        const noteData: NoteData = {
            title: titleRef.current!.value,
            markdown: markdownRef.current!.value,
            tags: selectedTags,
        };

        onSubmit(noteData);

        navigate("..");
    }

    return (
        <Form onSubmit={handleFormSubmit}>
            <Stack gap={4}>
                <Row>
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                ref={titleRef}
                                required
                                defaultValue={initialTitle}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <CreatableReactSelect
                                isMulti
                                onCreateOption={(label) => {
                                    const newTag: Tag = { id: uuidV4(), label };
                                    onAddTag(newTag);
                                    setSelectedTags((prevTags) => [...prevTags, newTag]);
                                }}
                                value={selectedTags.map((tag) => ({
                                    label: tag.label,
                                    value: tag.id,
                                }))}
                                options={availableTags.map((tag) => ({
                                    label: tag.label,
                                    value: tag.id,
                                }))}
                                onChange={(tags) =>
                                    setSelectedTags(
                                        tags.map((tag) => ({ label: tag.label, id: tag.value }))
                                    )
                                }
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="markdown">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        defaultValue={initialMarkdown}
                        required
                        as="textarea"
                        ref={markdownRef}
                        rows={15}
                    />
                </Form.Group>
                <Stack direction="horizontal" gap={2} className="justify-content-end">
                    <Button type="submit" variant="primary">
                        Save
                    </Button>
                    <Link to="..">
                        <Button type="button" variant="outline-secondary">
                            Cancel
                        </Button>
                    </Link>
                </Stack>
            </Stack>
        </Form>
    );
}
