// ===== THEME TOGGLE FUNCTIONALITY =====

class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }

    init() {
        // Apply stored theme
        this.applyTheme(this.currentTheme);

        // Initialize theme toggle button
        this.initializeThemeToggle();

        // Listen for system theme changes
        this.listenForSystemThemeChanges();
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    setStoredTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.updateThemeToggleIcon(theme);
        this.setStoredTheme(theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);

        // Add smooth transition effect
        this.addThemeTransition();

        // Show notification
        const themeName = newTheme.charAt(0).toUpperCase() + newTheme.slice(1);
        if (window.showNotification) {
            window.showNotification(`Switched to ${themeName} mode`, 'info', 2000);
        }
    }

    updateThemeToggleIcon(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }

            // Update aria-label for accessibility
            themeToggle.setAttribute('aria-label',
                theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
            );
        }
    }

    initializeThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });

            // Keyboard accessibility
            themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }
    }

    listenForSystemThemeChanges() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            // Only apply system theme if no manual theme is stored
            if (!this.getStoredTheme()) {
                const systemTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(systemTheme);
            }
        });
    }

    addThemeTransition() {
        // Add smooth transition for theme changes
        const transitionStyle = document.createElement('style');
        transitionStyle.textContent = `
            *, *::before, *::after {
                transition: background-color 0.3s ease,
                           color 0.3s ease,
                           border-color 0.3s ease,
                           box-shadow 0.3s ease !important;
            }
        `;

        document.head.appendChild(transitionStyle);

        // Remove transition after animation
        setTimeout(() => {
            transitionStyle.remove();
        }, 300);
    }

    // Method to programmatically set theme
    setTheme(theme) {
        if (['light', 'dark'].includes(theme)) {
            this.applyTheme(theme);
        }
    }

    // Method to reset to system theme
    resetToSystemTheme() {
        localStorage.removeItem('theme');
        const systemTheme = this.getSystemTheme();
        this.applyTheme(systemTheme);
    }

    // Get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }
}

// ===== THEME UTILITIES =====
class ThemeUtils {
    static getThemeColors(theme = null) {
        const currentTheme = theme || document.documentElement.getAttribute('data-theme') || 'light';

        if (currentTheme === 'dark') {
            return {
                primary: '#3b82f6',
                secondary: '#10b981',
                accent: '#8b5cf6',
                background: '#111827',
                surface: '#1f2937',
                text: '#f3f4f6',
                textSecondary: '#d1d5db'
            };
        } else {
            return {
                primary: '#2563eb',
                secondary: '#059669',
                accent: '#7c3aed',
                background: '#ffffff',
                surface: '#f9fafb',
                text: '#111827',
                textSecondary: '#6b7280'
            };
        }
    }

    static isDarkMode() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    static isLightMode() {
        return document.documentElement.getAttribute('data-theme') === 'light';
    }

    static onThemeChange(callback) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    const newTheme = document.documentElement.getAttribute('data-theme');
                    callback(newTheme);
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return observer;
    }
}

// ===== AUTO-INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme manager
    window.themeManager = new ThemeManager();

    // Make utilities globally available
    window.ThemeUtils = ThemeUtils;

    // Add theme-specific functionality
    initializeThemeSpecificFeatures();
});

// ===== THEME-SPECIFIC FEATURES =====
function initializeThemeSpecificFeatures() {
    // Update charts/graphs colors based on theme
    ThemeUtils.onThemeChange((newTheme) => {
        updateDynamicContent(newTheme);
    });

    // Initialize theme-aware components
    initializeThemeAwareComponents();
}

function updateDynamicContent(theme) {
    // Update any dynamic content that needs theme-specific styling
    const dynamicElements = document.querySelectorAll('[data-theme-dynamic]');

    dynamicElements.forEach(element => {
        const lightContent = element.getAttribute('data-light-content');
        const darkContent = element.getAttribute('data-dark-content');

        if (theme === 'dark' && darkContent) {
            element.innerHTML = darkContent;
        } else if (theme === 'light' && lightContent) {
            element.innerHTML = lightContent;
        }
    });

    // Update any charts or graphs if present
    updateChartsTheme(theme);
}

function updateChartsTheme(theme) {
    // This function can be extended to update chart libraries
    // Example for Chart.js or other charting libraries
    const colors = ThemeUtils.getThemeColors(theme);

    // Update chart colors if charts are present
    if (window.Chart && window.chartInstances) {
        window.chartInstances.forEach(chart => {
            chart.options.plugins.legend.labels.color = colors.text;
            chart.options.scales.x.ticks.color = colors.textSecondary;
            chart.options.scales.y.ticks.color = colors.textSecondary;
            chart.update();
        });
    }
}

function initializeThemeAwareComponents() {
    // Initialize components that need theme awareness
    const themeAwareElements = document.querySelectorAll('[data-theme-aware]');

    themeAwareElements.forEach(element => {
        const component = element.getAttribute('data-theme-aware');

        switch (component) {
            case 'syntax-highlighter':
                initializeSyntaxHighlighter(element);
                break;
            case 'code-editor':
                initializeCodeEditor(element);
                break;
            case 'map':
                initializeThemeAwareMap(element);
                break;
        }
    });
}

function initializeSyntaxHighlighter(element) {
    // Theme-aware syntax highlighting
    const updateHighlighterTheme = (theme) => {
        const isDark = theme === 'dark';
        element.className = element.className.replace(/(hljs-\w+)/g, '');
        element.classList.add(isDark ? 'hljs-dark' : 'hljs-light');
    };

    updateHighlighterTheme(ThemeUtils.isDarkMode() ? 'dark' : 'light');
    ThemeUtils.onThemeChange(updateHighlighterTheme);
}

function initializeCodeEditor(element) {
    // Theme-aware code editor (Monaco, CodeMirror, etc.)
    if (window.monaco) {
        const updateEditorTheme = (theme) => {
            window.monaco.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs-light');
        };

        updateEditorTheme(ThemeUtils.isDarkMode() ? 'dark' : 'light');
        ThemeUtils.onThemeChange(updateEditorTheme);
    }
}

function initializeThemeAwareMap(element) {
    // Theme-aware map styling (Google Maps, Mapbox, etc.)
    if (window.google && window.google.maps) {
        const updateMapTheme = (theme) => {
            const mapStyles = theme === 'dark' ? darkMapStyles : lightMapStyles;
            const map = element.mapInstance;
            if (map) {
                map.setOptions({ styles: mapStyles });
            }
        };

        ThemeUtils.onThemeChange(updateMapTheme);
    }
}

// ===== THEME PRESETS =====
const themePresets = {
    default: {
        light: {
            primary: '#2563eb',
            secondary: '#059669',
            accent: '#7c3aed'
        },
        dark: {
            primary: '#3b82f6',
            secondary: '#10b981',
            accent: '#8b5cf6'
        }
    },
    blue: {
        light: {
            primary: '#1e40af',
            secondary: '#0284c7',
            accent: '#7c2d12'
        },
        dark: {
            primary: '#3b82f6',
            secondary: '#0ea5e9',
            accent: '#ea580c'
        }
    },
    green: {
        light: {
            primary: '#059669',
            secondary: '#0d9488',
            accent: '#7c2d12'
        },
        dark: {
            primary: '#10b981',
            secondary: '#14b8a6',
            accent: '#ea580c'
        }
    }
};

// ===== ACCESSIBILITY FEATURES =====
function initializeAccessibilityFeatures() {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0.01ms');
        document.documentElement.style.setProperty('--transition-normal', '0.01ms');
        document.documentElement.style.setProperty('--transition-slow', '0.01ms');
    }

    // High contrast mode detection
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');

    if (prefersHighContrast.matches) {
        document.documentElement.classList.add('high-contrast');
    }

    prefersHighContrast.addEventListener('change', (e) => {
        document.documentElement.classList.toggle('high-contrast', e.matches);
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initializeAccessibilityFeatures);

// ===== EXPORT FOR GLOBAL ACCESS =====
window.themeManager = window.themeManager || null;
window.ThemeUtils = ThemeUtils;
