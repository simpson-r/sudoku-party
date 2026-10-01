import {
  Box,
  Clipboard,
  Flex,
  IconButton,
  IconButtonProps,
  Input,
  InputGroup,
  Link,
  Skeleton,
  useClipboard,
} from '@chakra-ui/react';

/**
 * This component displays a shareable invite link for the multiplayer room.
 */
export const InviteLink = ({
  roomId,
  isLoading,
}: {
  roomId: string;
  isLoading?: boolean;
}) => {
  const roomUrl = `${window.location.origin}/game/${roomId}`;
  const clipboard = useClipboard({ value: roomUrl });

  return (
    <Clipboard.Root value={roomUrl} opacity={isLoading ? 0.5 : 1} gap={1}>
      {/* mobile */}
      <Flex
        display={{ base: 'inline-flex', md: 'none' }}
        align="center"
        justify="center"
        gap={1}
      >
        <Clipboard.Label textStyle="label">Invite link:</Clipboard.Label>

        {isLoading ? (
          <Skeleton as="span" h={4} w="160px" borderRadius="none" />
        ) : (
          <Link
            as="span"
            textStyle="sm"
            display="inline-flex"
            alignItems="center"
            gap={1}
            onClick={clipboard.copy}
          >
            <Clipboard.ValueText />
            <Clipboard.Indicator />
          </Link>
        )}
      </Flex>

      {/* desktop */}
      <Box display={{ base: 'none', md: 'block' }}>
        <Clipboard.Label textStyle="label">Invite link:</Clipboard.Label>

        {isLoading ? (
          <Skeleton h={10} w="full" borderRadius="none" />
        ) : (
          <InputGroup
            endElement={<ClipboardIconButton onClick={clipboard.copy} />}
          >
            <Clipboard.Input asChild>
              <Input
                mt={0.5}
                overflow="hidden"
                textOverflow="ellipsis"
                borderRadius="none"
              />
            </Clipboard.Input>
          </InputGroup>
        )}
      </Box>
    </Clipboard.Root>
  );
};

const ClipboardIconButton = ({ onClick }: IconButtonProps) => {
  return (
    <Clipboard.Trigger asChild>
      <IconButton
        aria-label="copy link"
        variant="surface"
        size="xs"
        borderRadius="none"
        me="-2"
        onClick={onClick}
      >
        <Clipboard.Indicator />
      </IconButton>
    </Clipboard.Trigger>
  );
};
