'use client';

import {
  Button,
  Dialog,
  Field,
  Heading,
  HStack,
  Input,
  RadioGroup,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Difficulty } from '@shared/types';
import { PlayerMode, SetupConfig } from '../SudokuGrid/types';
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
  const [config, setConfig] = useState<SetupConfig>(INITIAL_CONFIG);
  const isSubmitDisabled =
    !config.name.trim() || !config.difficulty || !config.mode;

  const handleValueChange = <T extends keyof SetupConfig>(
    key: T,
    value: SetupConfig[T],
  ) => {
    setConfig((prevState) => ({ ...prevState, [key]: value }));
  };

  return (
    <Dialog.Root placement="center" open={isOpen} lazyMount unmountOnExit>
      <Dialog.Backdrop backdropFilter="blur(3px)" />
      <Dialog.Positioner>
        <Dialog.Content
          rounded="0"
          justifyContent="center"
          alignItems="center"
          bgColor="bg"
          border="2px solid"
          maxW={400}
          w="full"
        >
          <Dialog.Header flexDirection="column" textAlign="center">
            <Dialog.Title asChild>
              <Heading letterSpacing="-0.03em">Launch a Sudoku party!</Heading>
            </Dialog.Title>
            <Text>Select your Sudoku settings</Text>
          </Dialog.Header>

          <Dialog.Body>
            <VStack gap={3}>
              <Field.Root>
                <Field.Label color="fg">Name</Field.Label>
                <Input
                  rounded="0"
                  border="1.5px solid"
                  bgColor="bg.muted"
                  value={config.name}
                  onChange={(e) =>
                    handleValueChange('name', e.currentTarget.value)
                  }
                />
              </Field.Root>
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
          </Dialog.Body>

          <Dialog.Footer w="full" justifyContent="center">
            <Button
              w="9/12"
              color={isSubmitDisabled ? 'fg' : 'fg.inverted'}
              variant={isSubmitDisabled ? 'outline' : 'solid'}
              border="1.5px solid"
              rounded="0"
              loading={isLoading}
              onClick={() => onSubmit(config)}
              disabled={isSubmitDisabled}
            >
              Start party
            </Button>
          </Dialog.Footer>
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
      <Field.Label color="fg">{fieldLabel}</Field.Label>
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
              h={10}
              px={4}
              justifyContent="center"
              border="1.5px solid"
              borderColor="border.inverted"
              cursor="pointer"
              _checked={{ bg: 'bg.inverted', color: 'fg.inverted' }}
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
