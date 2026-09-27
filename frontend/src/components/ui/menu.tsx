import {
  Menu as ChakraMenu,
  Icon,
  ListCollection,
  MenuRootProps,
  Portal,
} from '@chakra-ui/react';

/**
 * This component renders a reusable menu using Chakra's "Menu" primitive.
 */
export const Menu = ({
  children,
  items,
  onMenuSelect,
  ...props
}: React.PropsWithChildren<
  {
    items: ListCollection;
    onMenuSelect: (value: string) => void;
  } & MenuRootProps
>) => {
  return (
    <ChakraMenu.Root lazyMount {...props}>
      <ChakraMenu.Trigger asChild>{children}</ChakraMenu.Trigger>
      <Portal>
        <ChakraMenu.Positioner>
          <ChakraMenu.Content rounded="md" minW={220} mt={3} p={0}  border='none'>
            {items.items.map((item) => (
              <ChakraMenu.Item
                key={item.value}
                value={item.value}
                color={item.color ?? 'fg'}
                cursor="pointer"
                py="10px"
                onClick={(e) => {
                  e.stopPropagation();
                  onMenuSelect(item.value);
                }}
              >
                {item.icon && <Icon as={item.icon} />}
                {item.label}
              </ChakraMenu.Item>
            ))}
          </ChakraMenu.Content>
        </ChakraMenu.Positioner>
      </Portal>
    </ChakraMenu.Root>
  );
};
