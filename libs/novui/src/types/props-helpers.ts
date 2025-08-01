import React from 'react';

export type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>['ref'];

export type AsProp<C extends React.ElementType> = {
  as?: C;
};

export type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

export type PolymorphicComponentProp<C extends React.ElementType, Props = {}> = React.PropsWithChildren<
  Props & AsProp<C>
> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

export type PolymorphicComponentPropWithRef<C extends React.ElementType, Props = {}> = PolymorphicComponentProp<
  C,
  Props
> & {
  ref?: PolymorphicRef<C>;
};

export function forwardRefWithAs<
  Component extends React.ElementType,
  Props = {}
>(render: (props: React.PropsWithoutRef<PolymorphicComponentPropWithRef<Component, Props>>, ref: React.ForwardedRef<any>) => React.ReactElement | null) {
  return React.forwardRef(render) as unknown as <As extends React.ElementType = Component>(
    props: PolymorphicComponentPropWithRef<As, Props>
  ) => React.ReactElement | null;
}
