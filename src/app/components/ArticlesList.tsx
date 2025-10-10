"use client";

import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import useArticles from "../../lib/hooks/useArticles";
import ArticleCard from "./ArticleCard";
import NoResults from "./NoResults";
import type { Article } from "../../lib/services/articles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";

export default function ArticlesList() {
  const [search, setSearch] = useState<string>("");
  const [site, setSite] = useState<string>("all");
  // drafts are the UI-controlled values; actual `search`/`site` are applied when user clicks Aplicar
  const [draftSearch, setDraftSearch] = useState<string>(search);
  const [draftSite, setDraftSite] = useState<string>(site);
  const [limit] = useState<number>(9);
  const [offset, setOffset] = useState<number>(0);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);
  const [cardWidth, setCardWidth] = useState<number | undefined>(undefined);
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  const params = useMemo(() => {
    const p: Record<string, unknown> = { limit, offset };
    if (search) p.title_contains = search;
    if (site && site !== "all") p.newsSite = site;
    return p;
  }, [limit, offset, search, site]);

  const { data: paginated } = useArticles(params as Record<string, unknown>);
  const isLoading = !paginated;
  // items memo already defined
  const items = useMemo(() => paginated?.results ?? [], [paginated]);

  // collect refs to rendered card wrappers
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const measureCards = useCallback(() => {
    const els = Object.values(cardRefs.current).filter(
      Boolean
    ) as HTMLDivElement[];
    if (!els.length) return;
    let maxH = 0;
    let maxW = 0;
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.height > maxH) maxH = rect.height;
      if (rect.width > maxW) maxW = rect.width;
    });
    // keep some sensible bounds
    if (maxH > 0) setCardHeight(Math.round(maxH));
    if (maxW > 0) setCardWidth(Math.round(maxW));
  }, []);

  // trigger measurement after items change
  useEffect(() => {
    // allow images to settle
    const t = setTimeout(() => measureCards(), 200);
    return () => clearTimeout(t);
  }, [items, measureCards]);

  const onCardImageLoad = useCallback(() => {
    // re-measure when images load to pick up height changes
    setTimeout(() => measureCards(), 50);
  }, [measureCards]);

  const sites = useMemo(() => {
    const s = new Set<string>();
    items.forEach((it) => {
      if (it && (it.newsSite ?? it.news_site))
        s.add(String(it.newsSite ?? it.news_site));
    });
    return Array.from(s).sort();
  }, [items]);

  // initialize theme on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("site-theme") as "light" | "dark" | null;
    const initial =
      saved ??
      (window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    document.documentElement.setAttribute("data-theme", initial);
    setTheme(initial);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("site-theme", next);
    setTheme(next);
  }, [theme]);

  const handlePrev = () => setOffset((o) => Math.max(0, o - limit));
  const handleNext = () => setOffset((o) => o + limit);

  return (
    <Box className="page-container">
      <Box className="page-inner">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 2 }}
          alignItems="center"
        >
          <Button variant="outlined" onClick={toggleTheme}>
            Alternar tema
          </Button>

          <Box
            component="form"
            onSubmit={(e) => e.preventDefault()}
            sx={{ flex: 1 }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
            >
              <TextField
                label="Pesquisar título"
                value={draftSearch}
                onChange={(e) => setDraftSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                fullWidth
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {isLoading ? (
                        <CircularProgress size={18} />
                      ) : (
                        <IconButton
                          aria-label="Limpar pesquisa"
                          onClick={() => setDraftSearch("")}
                          size="small"
                        >
                          ✕
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />

              <Select
                value={draftSite}
                onChange={(e) => setDraftSite(String(e.target.value))}
                size="small"
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="all">Todos os sites</MenuItem>
                {sites.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>

              <Button
                type="button"
                variant="contained"
                onClick={() => {
                  setSearch(draftSearch);
                  setSite(draftSite);
                  setOffset(0);
                }}
                sx={{ ml: "auto" }}
              >
                Aplicar
              </Button>
            </Stack>
          </Box>
        </Stack>

        {isLoading ? (
          <Grid container spacing={1} justifyContent="center">
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid xs={12} sm={6} md={4} key={i}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "16px 0",
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    sx={{ width: 320, height: 320, borderRadius: 1 }}
                  />
                </div>
              </Grid>
            ))}
          </Grid>
        ) : items.length === 0 ? (
          <NoResults />
        ) : (
          <Grid container spacing={1} justifyContent="center">
            {items.map((item: Article) => {
              const id = item.id ?? "";
              const title = String(item.title ?? "(sem título)");
              const url = String(item.url ?? "#");
              const imageUrl =
                item.imageUrl ?? item.image_url
                  ? String(item.imageUrl ?? item.image_url)
                  : null;
              const summary = String(item.summary ?? "");

              return (
                <Grid xs={12} sm={6} md={4} key={String(id)}>
                  <div
                    ref={(el) => {
                      cardRefs.current[String(id)] = el;
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: "16px 0",
                    }}
                  >
                    <ArticleCard
                      id={String(id)}
                      title={title}
                      imageUrl={imageUrl}
                      summary={summary}
                      url={url}
                      fixedHeight={cardHeight}
                      fixedWidth={cardWidth}
                      onImageLoad={onCardImageLoad}
                    />
                  </div>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          <Button
            variant="outlined"
            onClick={handlePrev}
            disabled={!paginated?.previous || offset === 0}
          >
            Anterior
          </Button>
          <Button
            variant="outlined"
            onClick={handleNext}
            disabled={!paginated?.next}
          >
            Próximo
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
