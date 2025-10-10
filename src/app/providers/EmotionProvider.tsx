"use client";

import React, { useState } from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { StyledEngineProvider } from "@mui/material/styles";

export default function EmotionProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [cache] = useState(() => {
    // Use prepend so Emotion/MUI styles are inserted at the start of the head.
    // This avoids relying on a manual insertion-point meta tag which can
    // cause ordering differences between server and client.
    return createCache({ key: "css", prepend: true });
  });

  return (
    <CacheProvider value={cache}>
      <StyledEngineProvider injectFirst>{children}</StyledEngineProvider>
    </CacheProvider>
  );
}
