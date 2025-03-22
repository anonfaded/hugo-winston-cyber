# Blog Theme Documentation

## Overview
A customized Hugo blog theme with dark mode and enhanced code block styling. Built on top of the Hugo Winston theme with significant UI/UX improvements and modern design elements. 

## Features

### 1. Dark Mode Implementation
- Custom dark theme with carefully selected colors
- Enhanced readability and contrast
- Smooth transitions between elements
- Color variables defined in `:root`:
  ```css
  --base-color: #0a0a0a
  --base-offset-color: #141414
  --highlight-color: #ED2939
  --heading-color: #ffffff
  --text-color: #e6e6e6
  --dot-color: #ED2939
  --code-bg: #1a1a1a
  ```

### 2. Code Block Enhancements
- Custom code block wrapper with header
- Syntax highlighting with theme-specific colors
- Copy button functionality
- Code expansion/lightbox feature
- Line numbers support
- Mobile-responsive design

### 3. Typography & Layout
- Font Stack:
  - Headings: Poppins
  - Body: Helvetica
  - Monospace: Ubuntu Mono
- Responsive text sizing
- Custom blockquote styling
- Enhanced list formatting

### 4. UI Components

#### Read Time Indicator
- Clean, minimal design
- Hover effects
- Icon integration

#### Article Summaries
- Animated borders
- Hover effects
- Date formatting
- Description preview

## Configuration

### Theme Settings
```toml
baseURL = "https://blog.fadedhood.com/"
languageCode = "en-us"
theme = "hugo-winston-theme"
themesDir = "themes"
title = "Hugo Winston Theme"
paginate = 3
pygmentsCodeFences = true
pygmentsCodefencesGuessSyntax = true
pygmentsUseClasses = true
```

#### Optional Features
The theme includes several optional features that can be toggled in the `config.toml` file under the `[params]` section:

```toml
[params]
  # Frame border around the viewport (disabled by default)
  addFrame = false  # Set to true to enable a border frame around the viewport
```

### Color Scheme
```css
--base-color: #0a0a0a
--base-offset-color: #141414
--highlight-color: #ED2939
--heading-color: #ffffff
--text-color: #e6e6e6
--dot-color: #ED2939
--code-bg: #1a1a1a
```

## File Structure

### CSS Files
1. `/public/css/custom.css`
   - Primary dark theme customization
   - Component styling
   - Animations

2. `/static/css/custom.css`
   - Dark theme variables
   - Core overrides

3. `/public/css/style.css`
   - Base theme styling
   - Layout structure

## Responsive Design
- Breakpoints:
  - Mobile: < 767px
  - Tablet: 768px - 991px
  - Desktop: > 992px
- Mobile-first approach
- Adaptive typography
- Responsive components

## Performance Optimizations
1. GPU-accelerated animations
2. Optimized asset loading
3. Conditional font loading
4. Minified CSS in production

## Development

### Prerequisites
- Hugo Extended v0.55.0+
- Node.js for development tools
- Basic understanding of SCSS

### Local Development
1. Clone the repository
2. Run `hugo server -D`
3. Access at `http://localhost:1313`

### Building for Production
1. Run `hugo --minify`
2. Deploy the `/public` directory

## Future Improvements
1. [ ] Search functionality
2. [ ] Comment system integration
3. [ ] Social sharing buttons


