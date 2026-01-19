# CLAUDE.md

This file provides context for Claude Code when working on this project.

## Project Overview

AWH Wellness Questionnaire is a web-based onboarding application for Advanced Women's Health. It guides users through 5 questions and generates 2 personalized wellness plans (Movement Plan + Nutrition Plan) based on their responses.

## Tech Stack

- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Custom properties, flexbox, grid, animations, responsive design
- **Vanilla JavaScript** - No dependencies, pure ES6+

## Project Structure

```
/awh-onboarding-app
├── index.html      # Main HTML structure with all screens
├── style.css       # Styles, responsive design, animations
├── script.js       # Application logic and decision trees
├── README.md       # Project documentation
├── CLAUDE.md       # This file - Claude Code context
└── .gitignore      # Git ignore rules
```

## Running Locally

Simply open `index.html` in a browser, or use a local server:

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server
```

## Key Files

### index.html
- Welcome screen
- 5 question screens (Q1-Q5)
- Results screen with plan cards
- Email modal for sharing results

### script.js
- State management for questionnaire flow
- `determineNutritionPlan(q1, q2, q4)` - Priority waterfall logic for nutrition
- `determineMovementPlan(q1, q3, q4, q5)` - Safety-first logic for movement
- Event handlers for navigation, selections, and bonus features
- Built-in test suite accessible via `AWHTest.runAll()` in console

### style.css
- CSS custom properties for theming (colors in `:root`)
- Mobile-first responsive design
- Smooth transitions and animations

## Decision Logic

### Nutrition Plan (Priority Order)
1. **Prenatal** - Pregnant/conceiving OR postpartum
2. **Gut Health** - Digestive goal OR digestive symptoms
3. **Anti-Inflammatory** - Inflammation goal OR joint pain
4. **Metabolic** - Weight/energy goal OR energy crashes
5. **General Health** - Default

### Movement Plan (Safety-First)
- **Stabilize & Gentle** - Pregnant/postpartum (automatic for safety)
- **Progressive Strength** - Requires ALL: stable energy, <2 symptoms, ready for strength
- **Stabilize & Gentle** - All other cases

## Testing

Run in browser console:
```javascript
AWHTest.runAll();           // Run all test scenarios
AWHTest.testPregnant();     // Test pregnant user path
AWHTest.testHealthyReady(); // Test healthy/ready user path
```

## Deployment

The app is deployed via GitHub Pages at:
https://elmandalorian-thx.github.io/awh-onboarding-app/

## Code Conventions

- Vanilla JS with ES6+ features
- State object manages all questionnaire data
- Event delegation for option selections
- CSS custom properties for easy theming

## Common Tasks

### Adding a Question
1. Add HTML in `index.html` following existing question pattern
2. Update `TOTAL_QUESTIONS` in `script.js`
3. Add answer handling in state and event listeners
4. Update decision logic if needed

### Modifying Plans
Edit `PLAN_DATA` object in `script.js`:
```javascript
const PLAN_DATA = {
    nutrition: { /* plan definitions */ },
    movement: { /* plan definitions */ }
};
```

### Changing Theme Colors
Edit CSS variables in `style.css`:
```css
:root {
    --color-primary: #4A7C59;
    --color-secondary: #7BA3A8;
    --color-accent: #D4A373;
}
```
