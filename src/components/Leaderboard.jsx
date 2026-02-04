import React from 'react';
import { Table, Card, Title, Badge, Text, Group } from '@mantine/core';
import { IconTrophy } from '@tabler/icons-react';

export function Leaderboard({ candidates, onSelectCandidate }) {
    const topCandidates = [...candidates]
        .sort((a, b) => b.total_score - a.total_score)
        .slice(0, 10);

    const rows = topCandidates.map((candidate, index) => (
        <Table.Tr
            key={candidate.id}
            onClick={() => onSelectCandidate(candidate)}
            style={{ cursor: 'pointer', transition: 'background 0.2s' }}
            className="hover-row"
        >
            <Table.Td>
                {index === 0 && <IconTrophy size={16} color="gold" />}
                {index === 1 && <IconTrophy size={16} color="silver" />}
                {index === 2 && <IconTrophy size={16} color="#cd7f32" />}
                {index > 2 && <Text size="sm" fw={500} c="dimmed">#{index + 1}</Text>}
            </Table.Td>
            <Table.Td>
                <Text fw={500}>{candidate.name}</Text>
            </Table.Td>
            <Table.Td>
                <Badge color={candidate.total_score > 25 ? 'green' : 'blue'} variant="light">
                    {candidate.total_score}
                </Badge>
            </Table.Td>
            <Table.Td hideBelow="sm">
                <Text size="xs" c="dimmed">{candidate.average_score}/10</Text>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Card shadow="sm" p="lg" radius="md" withBorder>
            <Card.Section p="md" withBorder>
                <Group justify="space-between">
                    <Title order={4}>🏆 Top 10 Candidates</Title>
                    <Badge variant="outline" color="yellow">Real-time</Badge>
                </Group>
            </Card.Section>

            <Table stickyHeader highlightOnHover verticalSpacing="sm">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th w={60}>Rank</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Score</Table.Th>
                        <Table.Th hideBelow="sm">Avg</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Card>
    );
}
