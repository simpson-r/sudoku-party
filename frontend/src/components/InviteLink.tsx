import {
  Box,
  Clipboard,
  IconButton,
  Input,
  InputGroup,
} from '@chakra-ui/react';
import { Game } from './layout/Game';

/**
 * This component displays the players currently in the room.
 */
export const InviteLink = ({ roomId }: { roomId: string }) => {
  const roomUrl = `${window.location.origin}/game/${roomId}`;
  return (
    <Clipboard.Root value={roomUrl}>
      <Clipboard.Label textStyle="label">Invite link</Clipboard.Label>

      <InputGroup endElement={<ClipboardIconButton />}>
        <Clipboard.Input asChild>
          <Input
            mt={0.5}
            overflow="hidden"
            textOverflow="ellipsis"
            borderRadius="none"
          />
        </Clipboard.Input>
      </InputGroup>
    </Clipboard.Root>
  );
};

const ClipboardIconButton = () => {
  return (
    <Clipboard.Trigger asChild>
      <IconButton
        aria-label="copy link"
        variant="surface"
        size="xs"
        bgColor="bg.inverted"
        color="fg.inverted"
        borderRadius="none"
        me="-2"
      >
        <Clipboard.Indicator />
      </IconButton>
    </Clipboard.Trigger>
  );
};
