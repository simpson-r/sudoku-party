import {
  Box,
  Clipboard,
  IconButton,
  Input,
  InputGroup,
} from '@chakra-ui/react';

/**
 * This component displays the players currently in the room.
 */
export const InviteLink = ({ roomId }: { roomId: string }) => {
  const roomUrl = `${window.location.origin}/game/${roomId}`;
  return (
    <Box borderRadius="none">
      <Clipboard.Root maxW="300px" value={roomUrl}>
        <Clipboard.Label textStyle="label">Invite Link</Clipboard.Label>
        <InputGroup endElement={<ClipboardIconButton />}>
          <Clipboard.Input asChild>
            <Input />
          </Clipboard.Input>
        </InputGroup>
      </Clipboard.Root>
    </Box>
  );
};

const ClipboardIconButton = () => {
  return (
    <Clipboard.Trigger asChild>
      <IconButton aria-label="copy link" variant="surface" size="xs" me="-2">
        <Clipboard.Indicator />
      </IconButton>
    </Clipboard.Trigger>
  );
};
