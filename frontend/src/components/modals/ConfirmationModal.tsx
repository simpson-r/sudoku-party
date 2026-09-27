'use client';

import { Button, Dialog, HStack, Text } from '@chakra-ui/react';

interface CTAConfig {
  heading: string;
  body: string;
  cancelText?: string;
  confirmText?: string;
}

const defaultCTA = {
  cancelText: 'Cancel',
  confirmText: 'Proceed',
};
/**
 * This component displays a modal that confirms whether the user wants to proceed with a specific action
 */
export const ConfirmationModal = ({
  ctaConfig,
  isOpen,
  isLoading = false,
  onClose,
  onConfirm,
}: {
  ctaConfig: CTAConfig;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: VoidFunction;
  onConfirm: VoidFunction;
}) => {
  const config = { ...defaultCTA, ...ctaConfig };
  const { heading, body, cancelText, confirmText } = config;
  return (
    <Dialog.Root
      placement="center"
      open={isOpen}
      lazyMount
      unmountOnExit
      onEscapeKeyDown={onClose}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          rounded="2xl"
          justifyContent="center"
          alignItems="center"
          bgColor="bg.subtle"
          maxW={350}
        >
          <Dialog.Header>
            <Dialog.Title fontSize="xl" textAlign="center">
              {heading}
            </Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <Text color="fg" textAlign="center">
              {body}
            </Text>
          </Dialog.Body>

          <Dialog.Footer>
            <HStack gap={4}>
              <Button color="fg.inverted" onClick={onClose}>
                {cancelText}
              </Button>
              <Button
                variant='outline'
                onClick={onConfirm}
                loading={isLoading}
              >
                {confirmText}
              </Button>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
