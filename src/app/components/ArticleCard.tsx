"use client";

import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

type Props = {
  id: number | string;
  title: string;
  imageUrl?: string | null;
  summary?: string | null;
  url?: string;
  fixedHeight?: number | undefined;
  onImageLoad?: (() => void) | undefined;
  fixedWidth?: number | undefined;
};

export default function ArticleCard({
  id,
  title,
  imageUrl,
  summary,
  url,
  fixedHeight,
  onImageLoad,
  fixedWidth,
}: Props) {
  return (
    <Card
      sx={{
        maxWidth: 320,
        margin: "auto",
        width: fixedWidth ? fixedWidth : undefined,
      }}
      key={id}
    >
      <CardActionArea href={url} component="a" target="_blank" rel="noreferrer">
        {imageUrl ? (
          <CardMedia
            component="img"
            height="120"
            image={imageUrl}
            alt={title}
            sx={{ objectFit: "cover" }}
            onLoad={() => {
              if (onImageLoad) onImageLoad();
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/default-article.svg";
              if (onImageLoad) onImageLoad();
            }}
          />
        ) : null}
        <CardContent
          sx={{
            pb: 2,
            height: fixedHeight ? fixedHeight - 120 : "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            gutterBottom
            variant="subtitle1"
            component="div"
            sx={{ fontWeight: 600 }}
          >
            {title}
          </Typography>
          <div
            className="article-summary-scroll"
            style={{ overflow: "auto", flex: 1 }}
          >
            <Typography variant="body2" color="text.secondary">
              {summary}
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
