# Geoapify API Setup Guide

## Overview
The AddressAutoComplete component uses the Geoapify geocoding service to provide address autocomplete functionality with Pakistan-specific results and coordinate extraction.

## Getting an API Key

1. Visit [Geoapify](https://www.geoapify.com/)
2. Sign up for a free account
3. Navigate to your dashboard
4. Generate a new API key
5. Copy the API key

## Environment Configuration

Create a `.env.local` file in your project root and add:

```bash
NEXT_PUBLIC_GEOAPIFY_API_KEY=your_actual_api_key_here
```

## Free Tier Limits

- **Free tier**: 3,000 requests per day
- **Paid plans**: Start from $0.50 per 1,000 requests

## Features

- **Pakistan-specific results**: Automatically filters results to Pakistan
- **Coordinate extraction**: Extracts latitude and longitude from selected addresses
- **Address validation**: Ensures addresses are properly formatted
- **Autocomplete suggestions**: Provides up to 5 address suggestions as you type

## Usage

The component is already integrated into the add property form and will:

1. Show address suggestions as you type
2. Extract coordinates when an address is selected
3. Save both address and coordinates to the database
4. Restrict results to Pakistan locations

## Troubleshooting

If you encounter issues:

1. Verify your API key is correct
2. Check your daily request limit
3. Ensure the `.env.local` file is in the project root
4. Restart your development server after adding the environment variable

## Security Note

The API key is exposed to the client-side as it's prefixed with `NEXT_PUBLIC_`. This is safe for geocoding services as they are designed to be used from client-side applications.
