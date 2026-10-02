'use client';

import {
  Button,
  Dialog,
  Field,
  Heading,
  HStack,
  RadioGroup,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Difficulty } from '@sudokuparty/shared/types';
import { PlayerMode, SetupConfig, SetupForm } from '../SudokuGrid/types';
import { useState } from 'react';

// constants
const DIFF_ITEMS: { label: string; key: Difficulty }[] = [
  { label: 'Easy', key: 'easy' },
  { label: 'Medium', key: 'medium' },
  { label: 'Hard', key: 'hard' },
];
const PLAYER_MODE_ITEMS: { label: string; key: PlayerMode }[] = [
  { label: 'Single', key: 'single' },
  { label: 'Multiplayer', key: 'multi' },
];
const INITIAL_CONFIG = { name: '', difficulty: undefined, mode: undefined };
const INPUT_HEIGHT = { base: 10, md: 12 };
/**
 * This component displays a modal for configuring a sudoku game
 */
export const GameSetupModal = ({
  isOpen,
  isLoading = false,
  onSubmit,
}: {
  isOpen: boolean;
  isLoading?: boolean;
  onSubmit: (config: SetupConfig) => void;
}) => {
  const [config, setConfig] = useState<SetupForm>(INITIAL_CONFIG);
  const isSubmitDisabled = !config.difficulty || !config.mode;

  const handleValueChange = <T extends keyof SetupConfig>(
    key: T,
    value: SetupConfig[T],
  ) => {
    setConfig((prevState) => ({ ...prevState, [key]: value }));
  };

  return (
    <Dialog.Root placement="center" open={isOpen} lazyMount unmountOnExit>
      <Dialog.Backdrop
        bg={{ base: 'blackAlpha.300', _dark: 'whiteAlpha.100' }}
        backdropFilter="blur(1px)"
        textTransform="lowercase"
      />
      <Dialog.Positioner>
        <Dialog.Content
          w={{ base: 'calc(100% - 32px)', md: '480px' }}
          minH={{ base: 'auto', md: '480px' }}
          aspectRatio={{ base: 'auto', md: '1 / 1' }}
          display="flex"
          flexDirection="column"
          border="4px solid"
          borderRadius={0}
          bg="bg"
          p={{ base: 6, md: 8 }}
          boxShadow="2xl"
        >
          <Dialog.Header
            flexDirection="column"
            textAlign="center"
            gap={3}
            pb={{ base: 3, md: 7 }}
          >
            <Dialog.Title asChild>
              <Heading
                fontSize={{ base: 'lg', sm: '2xl', md: '1.75rem' }}
                letterSpacing="-0.03em"
              >
                welcome to sudokuparty!
              </Heading>
            </Dialog.Title>
            <Text>choose your settings</Text>
          </Dialog.Header>

          <Dialog.Body
            w="9/12"
            mx="auto"
            p={0}
            display="flex"
            flexDirection="column"
            flex="1"
          >
            <VStack w="full" gap={{base: 1, md: 4}}>
              <ButtonFieldGroup
                fieldLabel="Difficulty"
                items={DIFF_ITEMS}
                value={config.difficulty}
                onValueChange={(value) =>
                  handleValueChange('difficulty', value)
                }
              />

              <ButtonFieldGroup
                fieldLabel="Mode"
                items={PLAYER_MODE_ITEMS}
                value={config.mode}
                onValueChange={(value) => handleValueChange('mode', value)}
              />
            </VStack>
            <Button
              w="full"
              h={INPUT_HEIGHT}
              mt={{base: 4, md: 'auto'}}
              color={isSubmitDisabled ? 'fg' : 'fg.inverted'}
              variant={isSubmitDisabled ? 'outline' : 'solid'}
              border={isSubmitDisabled ? '2px solid' : undefined}
              loading={isLoading}
              onClick={() => onSubmit(config as SetupConfig)}
              disabled={isSubmitDisabled}
            >
              play
            </Button>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

const ButtonFieldGroup = <T extends string>({
  fieldLabel,
  items,
  value,
  onValueChange,
}: {
  fieldLabel: string;
  items: readonly { label: string; key: T }[];
  value?: T;
  onValueChange: (value: T) => void;
}) => {
  return (
    <Field.Root>
      <Field.Label color="fg" fontSize={{ base: 'sm', sm: 'md' }}>
        {fieldLabel}
      </Field.Label>
      <RadioGroup.Root
        value={value}
        onValueChange={(details) => onValueChange(details.value as T)}
        w="full"
      >
        <HStack w="full" justify="center">
          {items.map(({ label, key }) => (
            <RadioGroup.Item
              key={key}
              value={key}
              flex={1}
              h={INPUT_HEIGHT}
              justifyContent="center"
              border="1.5px solid"
              borderColor="border.inverted"
              cursor="pointer"
              _checked={{
                bg: 'bg.inverted',
                color: 'fg.inverted',
                _hover: { bg: 'bg.inverted' },
              }}
              _hover={{ bg: 'bg.muted' }}
            >
              <RadioGroup.ItemText>{label}</RadioGroup.ItemText>
              <RadioGroup.ItemHiddenInput />
            </RadioGroup.Item>
          ))}
        </HStack>
      </RadioGroup.Root>
    </Field.Root>
  );
};
