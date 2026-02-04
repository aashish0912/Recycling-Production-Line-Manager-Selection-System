import React from 'react';
import { Card, Image, Text, Badge, Group, Button, Progress, ActionIcon, Tooltip } from '@mantine/core';
import { IconShare } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export function CandidateCard({ candidate, onClick }) {
    const getScoreColor = (score) => {
        if (score >= 8) return 'green';
        if (score >= 5) return 'yellow';
        return 'red';
    };

    const handleShare = (e) => {
        e.stopPropagation();
        const shareText = `Candidate: ${candidate.name}\nScore: ${candidate.total_score}\nSkills: ${candidate.skills}`;
        navigator.clipboard.writeText(shareText);
        notifications.show({
            title: 'Profile Shared',
            message: `Summary for ${candidate.name} copied to clipboard!`,
            color: 'teal',
        });
    };

    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
            onClick={() => onClick(candidate)}
            className="candidate-card"
        >
            <Card.Section>
                <Group justify="space-between" p="md" bg="var(--mantine-color-gray-0)">
                    <Group>
                        <Image
                            src={candidate.avatar}
                            h={40}
                            w={40}
                            radius="xl"
                            alt={candidate.name}
                            fallbackSrc="https://placehold.co/40x40"
                        />
                        <div>
                            <Text fw={600} size="sm">{candidate.name}</Text>
                            <Text size="xs" c="dimmed">{candidate.years_experience} Yrs Exp.</Text>
                        </div>
                    </Group>
                    <Badge size="lg" circle color={getScoreColor(candidate.average_score)}>
                        {Math.round(candidate.average_score)}
                    </Badge>
                </Group>
            </Card.Section>

            <Text mt="md" size="sm" c="dimmed" lineClamp={2}>
                "{candidate.feedback_text}"
            </Text>

            <Card.Section p="md">
                <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb={5}>
                    Scores
                </Text>
                <Group grow mb="xs">
                    <Tooltip label="Crisis Management">
                        <div>
                            <Progress value={candidate.crisis_mgmt_score * 10} color="red" size="sm" />
                            <Text size="xs" mt={2}>Crisis: {candidate.crisis_mgmt_score}</Text>
                        </div>
                    </Tooltip>
                    <Tooltip label="Sustainability">
                        <div>
                            <Progress value={candidate.sustainability_score * 10} color="green" size="sm" />
                            <Text size="xs" mt={2}>Sust: {candidate.sustainability_score}</Text>
                        </div>
                    </Tooltip>
                </Group>

                <Text size="xs" fw={700} tt="uppercase" c="dimmed" mt="md" mb={5}>
                    Skills
                </Text>
                <Group gap={5}>
                    {candidate.skills.split(',').slice(0, 3).map((skill, i) => (
                        <Badge key={i} size="xs" variant="dot" color="gray">
                            {skill.trim()}
                        </Badge>
                    ))}
                </Group>
            </Card.Section>

            <Button
                fullWidth
                mt="md"
                radius="md"
                variant="light"
                leftSection={<IconShare size={14} />}
                onClick={handleShare}
            >
                Share Profile
            </Button>
        </Card>
    );
}
