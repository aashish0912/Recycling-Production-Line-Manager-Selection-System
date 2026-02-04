import React from 'react';
import { Drawer, Text, Group, Badge, ThemeIcon, Title, Stack, Progress, Paper } from '@mantine/core';
import { IconUser, IconAward, IconLeaf, IconUsers, IconAlertTriangle } from '@tabler/icons-react';

export function CandidateDetailsDrawer({ candidate, opened, onClose }) {
    if (!candidate) return null;

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            title={<Title order={3}>{candidate.name}</Title>}
            position="right"
            size="lg"
            overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        >
            <Stack spacing="lg">
                {/* Header Info */}
                <Group>
                    <ThemeIcon size={64} radius="xl" variant="light" color="teal">
                        <IconUser size={32} />
                    </ThemeIcon>
                    <div>
                        <Text size="lg" fw={500}>Total Score: {candidate.total_score}</Text>
                        <Text c="dimmed" size="sm">Average: {candidate.average_score}/10</Text>
                        <Text c="dimmed" size="sm">{candidate.years_experience} Years Experience</Text>
                    </div>
                </Group>

                {/* Detailed Scores */}
                <Paper withBorder p="md" radius="md">
                    <Title order={5} mb="md">AI Evaluation Breakdown</Title>

                    <Stack spacing="md">
                        <div>
                            <Group justify="space-between" mb={5}>
                                <Group gap="xs">
                                    <IconAlertTriangle size={16} color="red" />
                                    <Text size="sm" fw={500}>Crisis Management</Text>
                                </Group>
                                <Badge color="red">{candidate.crisis_mgmt_score}/10</Badge>
                            </Group>
                            <Progress value={candidate.crisis_mgmt_score * 10} color="red" size="lg" radius="xl" />
                        </div>

                        <div>
                            <Group justify="space-between" mb={5}>
                                <Group gap="xs">
                                    <IconLeaf size={16} color="green" />
                                    <Text size="sm" fw={500}>Sustainability</Text>
                                </Group>
                                <Badge color="green">{candidate.sustainability_score}/10</Badge>
                            </Group>
                            <Progress value={candidate.sustainability_score * 10} color="green" size="lg" radius="xl" />
                        </div>

                        <div>
                            <Group justify="space-between" mb={5}>
                                <Group gap="xs">
                                    <IconUsers size={16} color="blue" />
                                    <Text size="sm" fw={500}>Team Motivation</Text>
                                </Group>
                                <Badge color="blue">{candidate.team_motivation_score}/10</Badge>
                            </Group>
                            <Progress value={candidate.team_motivation_score * 10} color="blue" size="lg" radius="xl" />
                        </div>
                    </Stack>
                </Paper>

                {/* Feedback Section */}
                <Paper withBorder p="md" radius="md" bg="var(--mantine-color-gray-0)">
                    <Title order={5} mb="xs">Full AI Feedback</Title>
                    <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                        {candidate.feedback_text}
                    </Text>
                </Paper>

                {/* Skills */}
                <div>
                    <Title order={5} mb="xs">Skills & Competencies</Title>
                    <Group gap="xs">
                        {candidate.skills.split(',').map((skill, i) => (
                            <Badge key={i} size="lg" variant="outline" color="gray">
                                {skill.trim()}
                            </Badge>
                        ))}
                    </Group>
                </div>
            </Stack>
        </Drawer>
    );
}
