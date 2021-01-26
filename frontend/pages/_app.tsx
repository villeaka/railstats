import React, { ComponentType, FunctionComponent } from "react";

import "../styles/globals.scss";

interface Props {
  Component: ComponentType;
  pageProps: Record<string, any>;
}

const App: FunctionComponent<Props> = (props: Props) => {
  const { Component, pageProps } = props;

  return <Component {...pageProps} />;
};

export default App;
