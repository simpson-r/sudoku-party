import { Box, HStack, Skeleton, Table, Text } from '@chakra-ui/react';

import { PlayerInfo } from '@shared/types';

/**
 * This component displays the players currently in the room.
 */
export const Players = ({
  playerId,
  players,
  isLoading = false,
}: {
  playerId?: string;
  players: PlayerInfo[];
  isLoading?: boolean;
}) => {
  return (
    <Table.Root variant="outline">
      <Table.Caption />
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader py={1}>Player</Table.ColumnHeader>
          <Table.ColumnHeader py={1} textAlign="end">
            Score
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {isLoading ? (
          <Table.Row>
            <Table.Cell colSpan={2} p={0}>
              <Skeleton w="full" h={8} borderRadius="none" />
            </Table.Cell>
          </Table.Row>
        ) : (
          players.map(({ id, name, score }) => (
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
          ))
        )}
      </Table.Body>
    </Table.Root>
  );
};
