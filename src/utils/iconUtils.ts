import { IconType } from 'react-icons';

/**
 * Converts react-icons IconType to a type compatible with Chakra UI Icon component
 * This is a workaround for the type incompatibility between react-icons and Chakra UI v2
 */
export const asIcon = (icon: IconType): React.ComponentType<any> => {
  return icon as React.ComponentType<any>;
};
