# Changelog

All notable changes to ZaytStore (formerly Motor-Oil-EG) are documented in this file.

Versions are created automatically by the release workflow using
[`github-tag-action`](https://github.com/mathieudutour/github-tag-action). See
[`.github/release-process.md`](.github/release-process.md) for the full release process.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions.

---

## [Unreleased]

### Fixed

- Navigation links: `Deals` and `Brands` in the top nav now point to distinct routes with correct
  active-state highlighting
- Footer deep-links for Synthetic / Semi-synthetic / Mineral / Filters now pre-filter the catalog
  via query params (`?base=`, `?category=`)
- Footer "Reviews" link now sorts the catalog by top-rated (`?sort=rating`)
- Footer dead `href="#"` links (Privacy policy, Partner agreement) replaced with real routes
- `router.push('/shop')` in `HomePage` and `SearchPage` fixed to `/search` (route was 404)
- `VehiclePage` now redirects to `/garage` after saving a vehicle instead of `/`
- `CatalogPage` now reads `?base=`, `?sort=`, `?category=`, and `?filter=` query params on mount
  so all deep-links from nav and footer apply filters automatically
- Prettier formatting applied to all source files
