"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Image from "next/image";
import notFoundImg from "@/assets/images/404.jpg";

export default function NoResults({ message }: { message?: string }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
      <Paper
        elevation={1}
        sx={{
          p: 4,
          maxWidth: 720,
          textAlign: "center",
          background: "transparent",
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Não foram encontrados artigos para a sua busca
        </Typography>
        {message ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {message}
          </Typography>
        ) : null}

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Image
            src={notFoundImg}
            alt="Nenhum resultado"
            width={480}
            height={320}
            style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
