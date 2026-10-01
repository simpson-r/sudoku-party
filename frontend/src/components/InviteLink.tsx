import {
  Box,
  Center,
  Clipboard,
  IconButton,
  IconButtonProps,
  Input,
  InputGroup,
  Link,
  useClipboard,
} from '@chakra-ui/react';

import { useBreakpoints } from '@/hooks/use-device-breakpoints';

/**
 * Displays a shareable invite link for the multiplayer room.
 */
export const InviteLink = ({ roomId }: { roomId: string }) => {
  const roomUrl = `${window.location.origin}/game/${roomId}`;
  const clipboard = useClipboard({ value: roomUrl });
  const { isMobile } = useBreakpoints();

  return (
    <Clipboard.Root value={roomUrl} justifyContent="flex-start">
      <Clipboard.Label textStyle="label">Invite link: </Clipboard.Label>
      {isMobile ? (
        <Link as="span" textStyle="sm" onClick={clipboard.copy}>
          <Clipboard.ValueText />
          <Clipboard.Indicator />
        </Link>
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
        me="-2"
        onClick={onClick}
      >
        <Clipboard.Indicator />
      </IconButton>
    </Clipboard.Trigger>
  );
};
