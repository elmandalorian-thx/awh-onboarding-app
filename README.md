# AWH Wellness Questionnaire

A web-based onboarding questionnaire app for Advanced Women's Health that guides users through 5 questions and outputs 2 personalized wellness plans (Movement Plan + Nutrition Plan).

## Overview

This single-page application creates a supportive, encouraging experience for users to discover their personalized wellness path. The questionnaire assesses:

- Life stage and context
- Primary health goals
- Energy and recovery patterns
- Current symptoms
- Movement preferences

Based on responses, users receive customized recommendations for both a **Movement Plan** and a **Nutrition Plan**.

## Features

- Clean, modern, mobile-responsive design
- Progress indicator showing question completion
- Smooth transitions between questions
- Smart decision logic for plan recommendations
- Results page with personalized plan details
- Download results as text file
- Email results (demo functionality)
- Print-friendly view
- Keyboard navigation support

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, flexbox, grid, animations
- **Vanilla JavaScript** - No dependencies required

## Getting Started

### Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/elmandalorian-thx/awh-onboarding-app.git
   cd awh-onboarding-app
   ```

2. Open in browser:
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000

     # Using Node.js (with http-server installed)
     npx http-server
     ```

3. Navigate to `http://localhost:8000` (or your chosen port)

### File Structure

```
/awh-onboarding-app
├── index.html      # Main HTML structure
├── style.css       # All styles and responsive design
├── script.js       # Application logic and decision trees
├── README.md       # This documentation
└── .gitignore      # Git ignore rules
```

## Decision Logic

### Nutrition Plan (Priority Waterfall)

The nutrition plan is determined by checking conditions in priority order:

1. **Prenatal Plan** - If user is pregnant/conceiving OR postpartum
2. **Gut Health Plan** - If health goal is digestive OR has digestive symptoms
3. **Anti-Inflammatory Plan** - If health goal is inflammation OR has joint pain
4. **Metabolic Plan** - If health goal is weight/energy OR has energy crashes
5. **General Health Plan** - Default for all other cases

```javascript
function determineNutritionPlan(q1, q2, q4) {
    if (q1 === 'pregnant_conceiving' || q1 === 'postpartum') return 'prenatal';
    if (q2 === 'digestive' || q4.includes('digestive_issues')) return 'gut_health';
    if (q2 === 'inflammation' || q4.includes('joint_pain')) return 'anti_inflammatory';
    if (q2 === 'weight_energy' || q4.includes('energy_crashes')) return 'metabolic';
    return 'general_health';
}
```

### Movement Plan (Safety-First Logic)

The movement plan uses a safety-first approach:

**Progressive Strength Path** requires ALL of:
- Stable energy and good recovery
- Less than 2 symptoms
- User indicates readiness for strength training

**Stabilize & Gentle Path** - All other cases

```javascript
function determineMovementPlan(q3, q4, q5) {
    const symptomCount = q4.filter(s => s !== 'none').length;
    const qualifiesForStrength =
        q3 === 'stable_recovery' &&
        symptomCount < 2 &&
        q5 === 'ready_strength';

    return qualifiesForStrength ? 'progressive_strength' : 'stabilize_gentle';
}
```

## Testing

### Test Scenarios

Open the browser console and run the built-in test suite:

```javascript
AWHTest.runAll();
```

Or test individual scenarios:

```javascript
// Scenario 1: Pregnant user → Prenatal + Stabilize
AWHTest.testPregnant();

// Scenario 2: Healthy + stable + ready → General Health + Progressive Strength
AWHTest.testHealthyReady();

// Scenario 3: Chronic symptoms + digestive → Gut Health + Stabilize
AWHTest.testChronicDigestive();

// Scenario 4: Burnout + weight goal + crashes → Metabolic + Stabilize
AWHTest.testBurnoutMetabolic();
```

### Manual Testing Checklist

- [ ] Complete questionnaire with various answer combinations
- [ ] Verify "None of the above" clears other symptom selections
- [ ] Test back/forward navigation
- [ ] Verify Next button disabled until question answered
- [ ] Test retake quiz functionality
- [ ] Test download results
- [ ] Test email modal
- [ ] Verify mobile responsiveness
- [ ] Test keyboard navigation (Enter to advance, Escape to close modal)

## Deployment

### GitHub Pages (Recommended)

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Under "Source", select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click Save
6. Your site will be live at `https://[username].github.io/awh-onboarding-app/`

### Netlify

1. Connect your GitHub repository to Netlify
2. Build settings (no build command needed):
   - Base directory: `/`
   - Publish directory: `/`
3. Deploy

### Vercel

1. Import your GitHub repository
2. Framework preset: Other
3. Deploy (no additional configuration needed)

## Customization

### Changing Colors

Edit the CSS variables in `style.css`:

```css
:root {
    --color-primary: #4A7C59;     /* Main brand color */
    --color-secondary: #7BA3A8;   /* Accent color */
    --color-accent: #D4A373;      /* Warm accent */
    /* ... */
}
```

### Adding Questions

1. Add question HTML in `index.html`
2. Update `TOTAL_QUESTIONS` in `script.js`
3. Add answer handling in state and event listeners
4. Update decision logic as needed

### Modifying Plan Descriptions

Edit the `PLAN_DATA` object in `script.js`:

```javascript
const PLAN_DATA = {
    nutrition: {
        your_plan: {
            name: 'Plan Name',
            description: 'Plan description',
            icon: '🎯'
        }
    }
};
```

## Accessibility

The application includes:
- Semantic HTML structure
- ARIA attributes where appropriate
- Focus-visible styling
- Keyboard navigation support
- High contrast colors
- Screen reader friendly content

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome for Android)

## License

This project is proprietary to Advanced Women's Health.

## Contributing

For internal development:
1. Create a feature branch
2. Make your changes
3. Test all scenarios
4. Submit a pull request

---

Built with care for Advanced Women's Health 🌿
