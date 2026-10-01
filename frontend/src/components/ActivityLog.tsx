import { Box, Table } from '@chakra-ui/react';

/**
 * This component displays the players currently in the room.
 */
export const ActivityLog = ({ activityLog }: { activityLog?: string[] }) => {
  return (
    <Box borderRadius="none">
      <Table.Root variant="outline">
        <Table.Caption />
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader py={1}>Activity</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {activityLog?.map((activity, id) => (
            <Table.Row key={id} _last={{ borderBottom: 'none' }}>
              <Table.Cell fontSize="xs" py={1}>
                {activity}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
