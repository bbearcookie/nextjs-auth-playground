import React from 'react';

const createSafeContext = <ContextValue,>(displayName?: string) => {
  const Context = React.createContext<ContextValue | null>(null);
  Context.displayName = displayName ?? 'SafeContext';

  const Provider = (props: ContextValue & { children: React.ReactNode }) => {
    const { children, ...context } = props;

    // prettier-ignore
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const value = React.useMemo(() => context, Object.values(context)) as ContextValue;
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const useSafeContext = () => {
    const context = React.useContext(Context);

    if (context === null) {
      throw new Error(
        `${displayName}: useSafeContext must be used within a SafeProvider`
      );
    }

    return context;
  };

  return [Provider, useSafeContext] as const;
};

export { createSafeContext };
