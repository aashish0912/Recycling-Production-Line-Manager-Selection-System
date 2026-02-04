import React from 'react';
import { Card, Title, Text } from '@mantine/core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function SkillHeatmap({ candidates }) {
    // Aggregate average scores for the visualization
    // Or visualize the top candidates?
    // Let's visualize the distribution OR top 5 candidates comparison

    // Let's show a "Market Overview" - Avg scores of all candidates vs Top candidate
    const topCandidate = [...candidates].sort((a, b) => b.total_score - a.total_score)[0];

    const avgCrisis = (candidates.reduce((acc, c) => acc + c.crisis_mgmt_score, 0) / candidates.length).toFixed(1);
    const avgSust = (candidates.reduce((acc, c) => acc + c.sustainability_score, 0) / candidates.length).toFixed(1);
    const avgMotiv = (candidates.reduce((acc, c) => acc + c.team_motivation_score, 0) / candidates.length).toFixed(1);

    const data = [
        {
            name: 'Crisis Mgmt',
            Average: avgCrisis,
            TopCandidate: topCandidate ? topCandidate.crisis_mgmt_score : 0,
        },
        {
            name: 'Sustainability',
            Average: avgSust,
            TopCandidate: topCandidate ? topCandidate.sustainability_score : 0,
        },
        {
            name: 'Motivation',
            Average: avgMotiv,
            TopCandidate: topCandidate ? topCandidate.team_motivation_score : 0,
        },
    ];

    return (
        <Card shadow="sm" p="lg" radius="md" withBorder h="100%">
            <Card.Section p="md" withBorder>
                <Title order={4}>📊 Skill Heatmap (Market vs Top Leader)</Title>
            </Card.Section>

            <div style={{ width: '100%', height: 300, marginTop: 20 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 10]} />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Average" fill="#8884d8" name="Market Avg" />
                        <Bar dataKey="TopCandidate" fill="#82ca9d" name={`Top: ${topCandidate?.name.split(' ')[0]}`} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
