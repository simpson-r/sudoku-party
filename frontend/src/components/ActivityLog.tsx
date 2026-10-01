import { Skeleton, Table } from '@chakra-ui/react';

/**
 * This component displays the three most recent player actions in the game
 */
export const ActivityLog = ({
  activityLog,
  isLoading = false,
}: {
  activityLog?: string[];
  isLoading?: boolean;
}) => {
  return (
    <Table.Root variant="outline">
      <Table.Caption />
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader py={1}>Activity</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {isLoading ? (
          <Table.Row>
            <Skeleton width="full" h={4} borderRadius="none" />
          </Table.Row>
        ) : (
          activityLog?.map((activity, id) => (
            <Table.Row key={id} _last={{ borderBottom: 'none' }}>
              <Table.Cell fontSize="xs" py={1}>
                {activity}
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table.Root>
  );
};
