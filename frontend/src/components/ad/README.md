# Ad Components

This directory contains all components related to property advertisements (ads).

## Structure

```
ad/
├── index.ts                    # Barrel exports for all components
│
├── AdCard.tsx                 # Display card for a single ad
├── AdCardSkeleton.tsx         # Loading skeleton for ad cards
├── AdEditForm.tsx             # Form for editing an existing ad
├── AdFilters.tsx              # Filtering component for ads list
├── AdForm.tsx                 # Form for creating a new ad
├── AdImagesSwiper.tsx         # Image carousel/swiper for ad images
├── AdsView.tsx                # Main view component for displaying ads list
├── ImagesUpload.tsx           # Image upload component with compression
├── Pagination.tsx             # Pagination controls
│
├── FormSections/              # Reusable form sections
│   ├── FormTitleSection.tsx
│   ├── FormLocationSection.tsx
│   ├── FormPropertyDetailsSection.tsx
│   ├── FormAdditionalDetailsSection.tsx
│   ├── FormContactSection.tsx
│   └── FormImagesSection.tsx
│
└── Select/                    # Form select components
    ├── CitySelect.tsx         # City selection dropdown
    └── AreaSelect.tsx         # Area selection dropdown
```

## Usage

### Importing Components

```typescript
// Using barrel exports (recommended)
import { AdCard, AdForm, AdFilters } from "@/components/ad";

// Individual imports
import AdCard from "@/components/ad/AdCard";
```

### Component Hierarchy

```
AdsView
  ├── AdFilters (sidebar drawer)
  └── AdCard[] (grid of cards)
      └── AdCardSkeleton (loading state)

AdForm / AdEditForm
  ├── FormTitleSection
  ├── FormLocationSection
  │   ├── CitySelect
  │   └── AreaSelect
  ├── FormPropertyDetailsSection
  ├── FormAdditionalDetailsSection
  ├── FormContactSection
  └── FormImagesSection
      └── ImagesUpload
```

## Notes

- All components are client components (use "use client")
- Form components use react-hook-form for state management
- Select components use react-select for better UX
- Images are automatically compressed on upload
- All components are memoized for performance where appropriate
