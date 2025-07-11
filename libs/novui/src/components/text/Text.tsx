import React from 'react';
import { css, cx } from '../../../styled-system/css';
import { splitCssProps } from '../../../styled-system/jsx';
import { text, type TextVariantProps } from '../../../styled-system/recipes';
import type { JsxStyleProps } from '../../../styled-system/types';
import { CoreProps } from '../../types';
import { PolymorphicComponentPropWithRef, PolymorphicRef, forwardRefWithAs } from '../../types/props-helpers';

export type TextProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  JsxStyleProps & TextVariantProps & CoreProps
>;

type PolymorphicComponent = <C extends React.ElementType = 'p'>(props: TextProps<C>) => JSX.Element | null;

export const Text: PolymorphicComponent = forwardRefWithAs<'p', JsxStyleProps & TextVariantProps & CoreProps>(
  <C extends React.ElementType = 'p'>(props: TextProps<C>, ref?: PolymorphicRef<C>) => {
    const [variantProps, textProps] = text.splitVariantProps(props);
    const [cssProps, localProps] = splitCssProps(textProps);
    const { className, as, ...otherProps } = localProps;
    const styles = text(variantProps);
    const Component = props.as || 'p';

    return <Component ref={ref} className={cx(styles, css(cssProps), className)} {...otherProps} />;
  }
);
