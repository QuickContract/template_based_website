import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface IconWrapperProps extends Omit<IconProps, 'as'> {
  as: IconType;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({ as, ...props }) => {
  return <Icon as={as as any} {...props} />;
};

export default IconWrapper;
