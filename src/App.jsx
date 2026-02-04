import React, { useState, useMemo } from 'react';
import { AppShell, Container, Title, Text, Group, Grid, TextInput, Paper, SimpleGrid, ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSearch, IconRecycle, IconSun, IconMoon } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import candidatesData from './data/candidates.json';
import { Leaderboard } from './components/Leaderboard';
import { SkillHeatmap } from './components/SkillHeatmap';
import { CandidateCard } from './components/CandidateCard';
import { CandidateDetailsDrawer } from './components/CandidateDetailsDrawer';

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  const filteredCandidates = useMemo(() => {
    return candidatesData.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate);
    openDrawer();
  };

  return (
    <AppShell header={{ height: 70 }} padding="md">
      <AppShell.Header p="md">
        <Container size="xl" h="100%">
          <Group justify="space-between" h="100%">
            <Group>
              <IconRecycle size={32} color="teal" />
              <div>
                <Title order={3}>GreenLine HR</Title>
                <Text size="xs" c="dimmed">Production Manager Selection System</Text>
              </div>
            </Group>
            <Group>
              <TextInput
                placeholder="Search by name or skill..."
                leftSection={<IconSearch size={16} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                w={300}
              />
              <ActionIcon
                onClick={toggleColorScheme}
                variant="default"
                size="lg"
                aria-label="Toggle color scheme"
              >
                {computedColorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
              </ActionIcon>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl" py="md">
          <Grid gutter="lg">
            {/* Top Row: Leaderboard & Heatmap */}
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Leaderboard
                candidates={filteredCandidates}
                onSelectCandidate={handleCandidateClick}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <SkillHeatmap candidates={filteredCandidates} />
            </Grid.Col>

            {/* Bottom Row: Candidate Grid */}
            <Grid.Col span={12}>
              <Title order={4} mb="md">All Candidates ({filteredCandidates.length})</Title>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
                {filteredCandidates.map(candidate => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onClick={handleCandidateClick}
                  />
                ))}
              </SimpleGrid>
            </Grid.Col>
          </Grid>

          <CandidateDetailsDrawer
            candidate={selectedCandidate}
            opened={drawerOpened}
            onClose={closeDrawer}
          />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
