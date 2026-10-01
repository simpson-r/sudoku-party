import { Box, HStack, Table, Text } from '@chakra-ui/react';

import { PlayerInfo } from '@shared/types';

/**
 * This component displays the players currently in the room.
 */
export const Players = ({
  playerId,
  players,
}: {
  playerId?: string;
  players: PlayerInfo[];
}) => {
  return (
    <Box borderRadius="none">
      <Table.Root variant="outline">
        <Table.Caption />
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader py={1}>Players</Table.ColumnHeader>
            <Table.ColumnHeader py={1} textAlign="end">
              Score
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {players.map(({ id, name, score }) => (
            <Table.Row key={id} _last={{ borderBottom: 'none' }}>
              <Table.Cell py={1}>
                <HStack>
                  {name}
                  {playerId === id && (
                    <Text fontSize="xs" color="fg.subtle">
                      {'(you)'}
                    </Text>
                  )}
                </HStack>
              </Table.Cell>
              <Table.Cell py={1} textAlign="end">
                {score}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
