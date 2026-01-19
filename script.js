/**
 * AWH Wellness Questionnaire
 * Advanced Women's Health Onboarding Application
 *
 * This script manages the questionnaire flow, decision logic,
 * and results display for the wellness onboarding experience.
 */

// ============================================
// Configuration & Constants
// ============================================

const TOTAL_QUESTIONS = 5;

// Plan descriptions for the results page
const PLAN_DATA = {
    nutrition: {
        prenatal: {
            name: 'Prenatal Nutrition Plan',
            description: 'Supporting you and baby with optimal nutrients for pregnancy and postpartum recovery',
            icon: '🤱'
        },
        gut_health: {
            name: 'Gut Health Plan',
            description: 'Healing your digestive system with anti-inflammatory foods and gut-supportive nutrition',
            icon: '🌿'
        },
        anti_inflammatory: {
            name: 'Anti-Inflammatory Plan',
            description: 'Reducing pain and inflammation through targeted nutrition strategies',
            icon: '🔥'
        },
        metabolic: {
            name: 'Metabolic Health Plan',
            description: 'Balancing blood sugar and supporting sustainable weight management',
            icon: '⚡'
        },
        general_health: {
            name: 'General Health Plan',
            description: 'Building a strong foundation with balanced, nourishing meals',
            icon: '🥗'
        }
    },
    movement: {
        progressive_strength: {
            name: 'Progressive Strength Path',
            description: 'Building strength with structured progression and tracking',
            icon: '💪'
        },
        stabilize_gentle: {
            name: 'Stabilize & Gentle Path',
            description: 'Rebuilding capacity with restorative, nervous-system-friendly movement',
            icon: '🧘'
        }
    }
};

// ============================================
// State Management
// ============================================

const state = {
    currentScreen: 'welcome',
    currentQuestion: 0,
    answers: {
        q1: null,
        q2: null,
        q3: null,
        q4: [],
        q5: null
    },
    results: {
        nutritionPlan: null,
        movementPlan: null
    }
};

// ============================================
// DOM Elements
// ============================================

const elements = {
    // Screens
    welcomeScreen: document.getElementById('welcomeScreen'),
    resultsScreen: document.getElementById('resultsScreen'),

    // Progress
    progressContainer: document.getElementById('progressContainer'),
    progressFill: document.getElementById('progressFill'),
    currentQuestionText: document.getElementById('currentQuestion'),

    // Navigation
    navFooter: document.getElementById('navFooter'),
    backBtn: document.getElementById('backBtn'),
    nextBtn: document.getElementById('nextBtn'),
    startBtn: document.getElementById('startBtn'),
    retakeBtn: document.getElementById('retakeBtn'),
    getStartedBtn: document.getElementById('getStartedBtn'),

    // Results
    movementIcon: document.getElementById('movementIcon'),
    movementPlanName: document.getElementById('movementPlanName'),
    movementPlanDesc: document.getElementById('movementPlanDesc'),
    nutritionIcon: document.getElementById('nutritionIcon'),
    nutritionPlanName: document.getElementById('nutritionPlanName'),
    nutritionPlanDesc: document.getElementById('nutritionPlanDesc'),

    // Bonus features
    downloadBtn: document.getElementById('downloadBtn'),
    emailBtn: document.getElementById('emailBtn'),
    emailModal: document.getElementById('emailModal'),
    closeModal: document.getElementById('closeModal'),
    emailForm: document.getElementById('emailForm'),
    emailInput: document.getElementById('emailInput'),
    emailSuccess: document.getElementById('emailSuccess')
};

// ============================================
// Decision Logic
// ============================================

/**
 * Determines the nutrition plan based on answers
 * Uses a priority waterfall approach
 *
 * @param {string} q1 - Life stage answer
 * @param {string} q2 - Health goal answer
 * @param {string[]} q4 - Current symptoms (array)
 * @returns {string} - Nutrition plan key
 */
function determineNutritionPlan(q1, q2, q4) {
    // Priority 1: Prenatal - pregnancy or postpartum takes precedence
    if (q1 === 'pregnant_conceiving' || q1 === 'postpartum') {
        return 'prenatal';
    }

    // Priority 2: Gut Health - digestive focus
    if (q2 === 'digestive' || q4.includes('digestive_issues')) {
        return 'gut_health';
    }

    // Priority 3: Anti-Inflammatory - pain and inflammation focus
    if (q2 === 'inflammation' || q4.includes('joint_pain')) {
        return 'anti_inflammatory';
    }

    // Priority 4: Metabolic Health - weight and energy focus
    if (q2 === 'weight_energy' || q4.includes('energy_crashes')) {
        return 'metabolic';
    }

    // Default: General Health
    return 'general_health';
}

/**
 * Determines the movement plan based on answers
 * Uses safety-first logic
 *
 * @param {string} q3 - Energy/recovery answer
 * @param {string[]} q4 - Current symptoms (array)
 * @param {string} q5 - Movement preference answer
 * @returns {string} - Movement plan key
 */
function determineMovementPlan(q3, q4, q5) {
    // Count symptoms (exclude 'none')
    const symptomCount = q4.filter(s => s !== 'none').length;

    // Progressive Strength Path requires ALL of:
    // - Stable energy (q3)
    // - Less than 2 symptoms (q4)
    // - User readiness (q5)
    const qualifiesForStrength =
        q3 === 'stable_recovery' &&
        symptomCount < 2 &&
        q5 === 'ready_strength';

    if (qualifiesForStrength) {
        return 'progressive_strength';
    }

    // Everything else goes to Stabilize & Gentle
    return 'stabilize_gentle';
}

/**
 * Calculate and store the final results
 */
function calculateResults() {
    const { q1, q2, q3, q4, q5 } = state.answers;

    state.results.nutritionPlan = determineNutritionPlan(q1, q2, q4);
    state.results.movementPlan = determineMovementPlan(q3, q4, q5);

    console.log('Results calculated:', state.results);
    console.log('Based on answers:', state.answers);
}

// ============================================
// Screen Management
// ============================================

/**
 * Get question screen element by number
 */
function getQuestionScreen(num) {
    return document.getElementById(`question${num}`);
}

/**
 * Show a specific screen with transition
 */
function showScreen(screenId, direction = 'forward') {
    const allScreens = document.querySelectorAll('.screen');

    allScreens.forEach(screen => {
        if (screen.classList.contains('active')) {
            screen.classList.add('exiting');
            setTimeout(() => {
                screen.classList.remove('active', 'exiting');
            }, 250);
        }
    });

    setTimeout(() => {
        let targetScreen;

        if (screenId === 'welcome') {
            targetScreen = elements.welcomeScreen;
        } else if (screenId === 'results') {
            targetScreen = elements.resultsScreen;
        } else {
            targetScreen = getQuestionScreen(screenId);
        }

        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }, 260);
}

/**
 * Update progress bar and question counter
 */
function updateProgress() {
    const progress = (state.currentQuestion / TOTAL_QUESTIONS) * 100;
    elements.progressFill.style.width = `${progress}%`;
    elements.currentQuestionText.textContent = state.currentQuestion;
}

/**
 * Show or hide navigation elements
 */
function updateNavigation() {
    const isWelcome = state.currentScreen === 'welcome';
    const isResults = state.currentScreen === 'results';
    const isQuestion = !isWelcome && !isResults;

    // Progress bar visibility
    elements.progressContainer.classList.toggle('visible', isQuestion);

    // Navigation footer visibility
    elements.navFooter.classList.toggle('visible', isQuestion);

    // Back button state
    elements.backBtn.disabled = state.currentQuestion <= 1;

    // Update next button text for last question
    if (state.currentQuestion === TOTAL_QUESTIONS) {
        elements.nextBtn.innerHTML = 'See Results <span class="btn-arrow">→</span>';
    } else {
        elements.nextBtn.innerHTML = 'Next <span class="btn-arrow">→</span>';
    }
}

/**
 * Check if current question has been answered
 */
function isCurrentQuestionAnswered() {
    const questionNum = state.currentQuestion;

    if (questionNum === 4) {
        // Question 4 is multiple choice - need at least one selection
        return state.answers.q4.length > 0;
    } else {
        // Single choice questions
        return state.answers[`q${questionNum}`] !== null;
    }
}

/**
 * Update the next button enabled state
 */
function updateNextButton() {
    elements.nextBtn.disabled = !isCurrentQuestionAnswered();
}

// ============================================
// Event Handlers
// ============================================

/**
 * Handle start button click
 */
function handleStart() {
    state.currentScreen = 'question';
    state.currentQuestion = 1;

    showScreen(1);
    updateProgress();
    updateNavigation();
    updateNextButton();
}

/**
 * Handle next button click
 */
function handleNext() {
    if (!isCurrentQuestionAnswered()) return;

    if (state.currentQuestion < TOTAL_QUESTIONS) {
        state.currentQuestion++;
        showScreen(state.currentQuestion);
        updateProgress();
        updateNavigation();
        updateNextButton();
    } else {
        // Show results
        calculateResults();
        displayResults();
        state.currentScreen = 'results';
        showScreen('results');
        updateNavigation();
    }
}

/**
 * Handle back button click
 */
function handleBack() {
    if (state.currentQuestion > 1) {
        state.currentQuestion--;
        showScreen(state.currentQuestion, 'backward');
        updateProgress();
        updateNavigation();
        updateNextButton();
    }
}

/**
 * Handle option selection for single-choice questions
 */
function handleSingleSelect(questionNum, value) {
    state.answers[`q${questionNum}`] = value;
    updateNextButton();
}

/**
 * Handle option selection for multiple-choice (question 4)
 */
function handleMultiSelect(value, isChecked) {
    if (value === 'none') {
        // If "none" is selected, clear all other selections
        if (isChecked) {
            state.answers.q4 = ['none'];
            // Uncheck all other checkboxes
            document.querySelectorAll('#question4 input[type="checkbox"]').forEach(cb => {
                if (cb.value !== 'none') {
                    cb.checked = false;
                }
            });
        } else {
            state.answers.q4 = [];
        }
    } else {
        // If any other option is selected, remove "none"
        if (isChecked) {
            state.answers.q4 = state.answers.q4.filter(v => v !== 'none');
            state.answers.q4.push(value);
            // Uncheck "none" checkbox
            const noneCheckbox = document.getElementById('noneCheckbox');
            if (noneCheckbox) {
                noneCheckbox.checked = false;
            }
        } else {
            state.answers.q4 = state.answers.q4.filter(v => v !== value);
        }
    }

    updateNextButton();
}

/**
 * Handle retake quiz button
 */
function handleRetake() {
    // Reset state
    state.currentScreen = 'welcome';
    state.currentQuestion = 0;
    state.answers = {
        q1: null,
        q2: null,
        q3: null,
        q4: [],
        q5: null
    };
    state.results = {
        nutritionPlan: null,
        movementPlan: null
    };

    // Clear all form selections
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Show welcome screen
    showScreen('welcome');
    updateNavigation();
    elements.progressFill.style.width = '20%';
}

/**
 * Display results on the results screen
 */
function displayResults() {
    const { nutritionPlan, movementPlan } = state.results;

    // Update movement plan
    const movementData = PLAN_DATA.movement[movementPlan];
    elements.movementIcon.textContent = movementData.icon;
    elements.movementPlanName.textContent = movementData.name;
    elements.movementPlanDesc.textContent = movementData.description;

    // Update nutrition plan
    const nutritionData = PLAN_DATA.nutrition[nutritionPlan];
    elements.nutritionIcon.textContent = nutritionData.icon;
    elements.nutritionPlanName.textContent = nutritionData.name;
    elements.nutritionPlanDesc.textContent = nutritionData.description;
}

// ============================================
// Bonus Features
// ============================================

/**
 * Download results as a text file (PDF would require library)
 */
function handleDownload() {
    const { nutritionPlan, movementPlan } = state.results;
    const nutritionData = PLAN_DATA.nutrition[nutritionPlan];
    const movementData = PLAN_DATA.movement[movementPlan];

    const content = `
═══════════════════════════════════════════════════════
    YOUR PERSONALIZED WELLNESS PATH
    Advanced Women's Health
═══════════════════════════════════════════════════════

MOVEMENT PLAN
─────────────
${movementData.name}
${movementData.description}

NUTRITION PLAN
──────────────
${nutritionData.name}
${nutritionData.description}

═══════════════════════════════════════════════════════
Generated on: ${new Date().toLocaleDateString()}

Visit advancedwomenshealth.com to get started!
═══════════════════════════════════════════════════════
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AWH-Wellness-Plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Show email modal
 */
function showEmailModal() {
    elements.emailModal.classList.add('active');
    elements.emailInput.focus();
    elements.emailSuccess.classList.remove('show');
}

/**
 * Hide email modal
 */
function hideEmailModal() {
    elements.emailModal.classList.remove('active');
    elements.emailInput.value = '';
}

/**
 * Handle email form submission
 * Note: In production, this would send to a backend
 */
function handleEmailSubmit(e) {
    e.preventDefault();

    const email = elements.emailInput.value;

    // In production, you would send this to your backend
    console.log('Would email results to:', email);
    console.log('Results:', state.results);

    // Show success message
    elements.emailSuccess.classList.add('show');

    // Close modal after delay
    setTimeout(() => {
        hideEmailModal();
    }, 2000);
}

/**
 * Handle get started button (placeholder)
 */
function handleGetStarted() {
    // In production, this would redirect to the main app or program signup
    alert('Thank you for completing the questionnaire! In the full app, this would take you to begin your personalized program.');
}

// ============================================
// Event Listeners Setup
// ============================================

function setupEventListeners() {
    // Main navigation
    elements.startBtn.addEventListener('click', handleStart);
    elements.nextBtn.addEventListener('click', handleNext);
    elements.backBtn.addEventListener('click', handleBack);
    elements.retakeBtn.addEventListener('click', handleRetake);
    elements.getStartedBtn.addEventListener('click', handleGetStarted);

    // Single select questions (1, 2, 3, 5)
    [1, 2, 3, 5].forEach(qNum => {
        const questionScreen = getQuestionScreen(qNum);
        if (questionScreen) {
            questionScreen.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    handleSingleSelect(qNum, e.target.value);
                });
            });
        }
    });

    // Multiple select question (4)
    const question4 = getQuestionScreen(4);
    if (question4) {
        question4.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                handleMultiSelect(e.target.value, e.target.checked);
            });
        });
    }

    // Bonus features
    elements.downloadBtn.addEventListener('click', handleDownload);
    elements.emailBtn.addEventListener('click', showEmailModal);
    elements.closeModal.addEventListener('click', hideEmailModal);
    elements.emailForm.addEventListener('submit', handleEmailSubmit);

    // Close modal on outside click
    elements.emailModal.addEventListener('click', (e) => {
        if (e.target === elements.emailModal) {
            hideEmailModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.emailModal.classList.contains('active')) {
            hideEmailModal();
        }

        // Enter key to advance (if question answered)
        if (e.key === 'Enter' && state.currentScreen === 'question') {
            if (!elements.emailModal.classList.contains('active') && isCurrentQuestionAnswered()) {
                handleNext();
            }
        }
    });
}

// ============================================
// Initialization
// ============================================

function init() {
    setupEventListeners();

    // Initial state - welcome screen is active by default in HTML
    updateNavigation();

    console.log('AWH Wellness Questionnaire initialized');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// ============================================
// Testing Utilities (can be removed in production)
// ============================================

/**
 * Test scenarios for debugging
 * Run these in the browser console
 */
window.AWHTest = {
    // Test Scenario 1: Pregnant user → Should get Prenatal + Stabilize
    testPregnant: () => {
        const result = {
            nutrition: determineNutritionPlan('pregnant_conceiving', 'feel_better', []),
            movement: determineMovementPlan('stable_recovery', [], 'ready_strength')
        };
        console.log('Pregnant user test:', result);
        console.assert(result.nutrition === 'prenatal', 'Should get prenatal nutrition');
        return result;
    },

    // Test Scenario 2: Healthy + stable + ready → Should get General Health + Progressive Strength
    testHealthyReady: () => {
        const result = {
            nutrition: determineNutritionPlan('generally_healthy', 'build_strength', ['none']),
            movement: determineMovementPlan('stable_recovery', ['none'], 'ready_strength')
        };
        console.log('Healthy ready user test:', result);
        console.assert(result.nutrition === 'general_health', 'Should get general_health nutrition');
        console.assert(result.movement === 'progressive_strength', 'Should get progressive_strength movement');
        return result;
    },

    // Test Scenario 3: Chronic symptoms + digestive → Should get Gut Health + Stabilize
    testChronicDigestive: () => {
        const result = {
            nutrition: determineNutritionPlan('chronic_symptoms', 'digestive', ['digestive_issues', 'poor_sleep']),
            movement: determineMovementPlan('unpredictable', ['digestive_issues', 'poor_sleep'], 'gentle')
        };
        console.log('Chronic digestive user test:', result);
        console.assert(result.nutrition === 'gut_health', 'Should get gut_health nutrition');
        console.assert(result.movement === 'stabilize_gentle', 'Should get stabilize_gentle movement');
        return result;
    },

    // Test Scenario 4: Burnout + weight goal + crashes → Should get Metabolic + Stabilize
    testBurnoutMetabolic: () => {
        const result = {
            nutrition: determineNutritionPlan('burnout_fragile', 'weight_energy', ['energy_crashes']),
            movement: determineMovementPlan('drained', ['energy_crashes'], 'need_guidance')
        };
        console.log('Burnout metabolic user test:', result);
        console.assert(result.nutrition === 'metabolic', 'Should get metabolic nutrition');
        console.assert(result.movement === 'stabilize_gentle', 'Should get stabilize_gentle movement');
        return result;
    },

    // Run all tests
    runAll: () => {
        console.log('Running all test scenarios...');
        window.AWHTest.testPregnant();
        window.AWHTest.testHealthyReady();
        window.AWHTest.testChronicDigestive();
        window.AWHTest.testBurnoutMetabolic();
        console.log('All tests completed!');
    }
};
