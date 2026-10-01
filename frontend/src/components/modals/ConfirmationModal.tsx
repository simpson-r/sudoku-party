'use client';

import { Button, Dialog, HStack, Text } from '@chakra-ui/react';

interface CTAConfig {
  heading: string;
  body: string;
  cancelText?: string;
  confirmText?: string;
}

/**
 * This component displays a modal that confirms whether the user wants to proceed with a specific action
 */
export const ConfirmationModal = ({
  ctaConfig: config,
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
  const { heading, body, cancelText, confirmText } = config;
  return (
    <Dialog.Root
      placement="center"
      open={isOpen}
      lazyMount
      unmountOnExit
      onEscapeKeyDown={onClose}
    >
      <Dialog.Backdrop
        bg={{ base: 'blackAlpha.300', _dark: 'whiteAlpha.200' }}
      />
      <Dialog.Positioner>
        <Dialog.Content
          justifyContent="center"
          alignItems="center"
          maxW={350}
          bgColor="bg.subtle"
          border="2px solid"
          borderColor="border.inverted"
          borderRadius="none"
        >
          <Dialog.Header>
            <Dialog.Title fontFamily="heading" fontSize="xl" textAlign="center">
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
              {cancelText && (
                <Button color="fg.inverted" onClick={onClose}>
                  {cancelText}
                </Button>
              )}
              <Button
                variant="outline"
                borderRadius="none"
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
